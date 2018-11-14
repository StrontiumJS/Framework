import { RouterMap } from "../abstract/RouterMap"
import { HTTPError } from "../../errors"
import { InvalidControllerError } from "../../errors"
import { InternalServerError } from "../../errors"
import * as Fastify from "fastify"
import { Container } from "inversify"
import { Logger } from "../../logging"
import { AddressInfo } from "net"
import { Process } from "../../runtime"
import { ConstructorOf } from "../../utils/types"
import { isObject } from "../../validation"

import { EndpointController } from ".."

export class FastifyServer implements Process {
    private server: Fastify.FastifyInstance = Fastify()
    private isAlive: boolean = false

    constructor(
        public routes: RouterMap,
        private port: number = 8080,
        private host: string = "127.0.0.1"
    ) {
        for (let route of routes) {
            switch (route.method) {
                case "GET":
                    this.server.get(
                        route.route,
                        this.requestHandler(
                            route.endpointController,
                            route.route,
                            "GET"
                        )
                    )
                    break
                case "POST":
                    this.server.post(
                        route.route,
                        this.requestHandler(
                            route.endpointController,
                            route.route,
                            "POST"
                        )
                    )
                    break
                case "PATCH":
                    this.server.patch(
                        route.route,
                        this.requestHandler(
                            route.endpointController,
                            route.route,
                            "PATCH"
                        )
                    )
                    break
                case "PUT":
                    this.server.put(
                        route.route,
                        this.requestHandler(
                            route.endpointController,
                            route.route,
                            "PUT"
                        )
                    )
                    break
                case "DELETE":
                    this.server.delete(
                        route.route,
                        this.requestHandler(
                            route.endpointController,
                            route.route,
                            "DELETE"
                        )
                    )
                    break
                case "OPTIONS":
                    this.server.options(
                        route.route,
                        this.requestHandler(
                            route.endpointController,
                            route.route,
                            "OPTIONS"
                        )
                    )
                    break
            }
        }
    }

    public isHealthy(): boolean {
        return this.isAlive
    }

    public async shutdown(container: Container): Promise<void> {
        // Cleanly close the server to requests.
        await new Promise<void>((resolve) => {
            this.server.close(resolve)
        })

        this.isAlive = false
    }

    public async startup(container: Container): Promise<void> {
        // Attach the container to the server
        this.server.decorateRequest("container", container)

        let middleware = this.getMiddleware(container)
        for (let m of middleware) {
            this.server.use(m)
        }

        await this.server.listen(this.port, this.host)
        this.isAlive = true

        let loggerInstance = container.get(Logger)
        if (loggerInstance) {
            loggerInstance.info(
                `Fastify HTTP Server started on port ${
                    (this.server.server.address() as AddressInfo).port
                }`,
                this.server.server.address()
            )
        }
    }

    protected getMiddleware(
        container: Container
    ): Array<Fastify.Middleware<any, any, any>> {
        return []
    }

    protected getRequestMetadata = (
        request: Fastify.FastifyRequest<any, any, any, any, any>
    ): { [key: string]: any } => ({})

    protected requestHandler(
        controller: ConstructorOf<EndpointController>,
        path: string,
        method: string
    ): (
        request: Fastify.FastifyRequest<any, any, any, any, any>,
        response: Fastify.FastifyReply<any>
    ) => Promise<any> {
        return async (request, response) => {
            // Force any to circumvent poor typing from Fastify for their Declare functions
            let applicationContainer = (request as any).container as Container

            // Create a new DI Container for the life of this request
            let requestContainer = new Container({
                autoBindInjectable: true,
                skipBaseClassChecks: true,
            })

            requestContainer.parent = applicationContainer

            // Register request and response with the DI container directly so that Controller's can access
            // if an escape hatch is required
            requestContainer.bind("request").toConstantValue(request)
            requestContainer.bind("response").toConstantValue(response)

            let endpointController:
                | EndpointController
                | undefined = requestContainer.get(controller)

            if (endpointController === undefined) {
                throw new InvalidControllerError(path)
            }

            // Validate the input
            let inputValidatorSchema = endpointController.inputValidator

            let validatedInput
            let rawResponse
            try {
                let validator = isObject({
                    body: inputValidatorSchema.body,
                    headers: isObject(inputValidatorSchema.headers),
                    query: isObject(inputValidatorSchema.query),
                    params: isObject(inputValidatorSchema.params),
                    meta: isObject(inputValidatorSchema.meta),
                })

                validatedInput = await validator({
                    // Don't send the body through if the
                    body: method === "GET" ? undefined : request.body,
                    headers: request.headers,
                    query: request.query,
                    params: request.params,
                    meta: this.getRequestMetadata(request),
                })

                rawResponse = await endpointController.handle(validatedInput)
            } catch (e) {
                // Detect Input Validation issues.
                // Any other errors will be thrown directly if they are HTTPError compatible or 500 and logged if not.
                if (e instanceof HTTPError) {
                    response.code(e.statusCode)
                    return e.toResponseBody()
                } else {
                    let logger = requestContainer.get(Logger)
                    if (logger) {
                        logger.error("[HTTP - REQUEST - FAILED]", e)
                    }

                    let publicError = new InternalServerError()
                    response.code(publicError.statusCode)
                    return publicError.toResponseBody()
                }
            }

            try {
                let validatedOutput = await endpointController.outputValidator(
                    rawResponse
                )

                // Handle an edge case in Fastify that doesn't allow async/await undefined returns
                if (validatedOutput === undefined) {
                    return response.send()
                }

                return validatedOutput
            } catch (e) {
                // Handle errors in the output validation.
                // Returns 500 errors as this shouldn't really happen and is normally a developer issue.
                let logger = requestContainer.get(Logger)
                if (logger) {
                    logger.error(
                        `[HTTP - VALIDATION - FAILED] An error occurred validating the output of ${
                            controller.name
                        }. Check that you are returning the correct value.`,
                        e
                    )
                }

                let publicError = new InternalServerError()
                response.code(publicError.statusCode)
                return publicError.toResponseBody()
            }
        }
    }
}
