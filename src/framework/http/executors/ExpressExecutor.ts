import { EndpointControllerConstructor } from "../EndpointController"
import { HTTPError } from "../../errors/http/HTTPError"
import { InternalError } from "../../errors/http/InternalError"
import { Renderable } from "../Renderable"
import { UnauthorizedError } from "../../errors/http/UnauthorizedError"
import { Request, Response } from "express"

export class ExpressExecutor {
    constructor() {}

    /**
     * Process the error before returning it to the client. This is an ideal time to log the error or record it in
     * an error management system such as OpBeat or Sentry.
     *
     * Returning nothing will cause the client to receive a standard 500 internal error code.
     * In the case that an HTTPError object is returned then it will be processed normally as if the controller
     * had produced that error originally.
     *
     * @param {Error} e
     * @returns {Promise<void | Error>}
     */
    public async handleError(e: Error): Promise<void | HTTPError> {
        console.error(e)
    }

    /**
     * Generate an Express Middleware function that executes the Controller provided.
     *
     * @param {EndpointControllerConstructor} Controller
     * @returns {(req: Request, res: e.Response) => void}
     */
    public middleware(
        Controller: EndpointControllerConstructor
    ): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            let controller_instance = new Controller()

            try {
                // Extract the data from the request
                await controller_instance.extract(req)

                // Validate that the controller inputs are valid
                await controller_instance.validate()

                // Initialize the controller
                await controller_instance.init()

                // Authorize the action
                let authorization_status = await controller_instance.authorize()

                if (authorization_status !== true) {
                    throw new UnauthorizedError("Authorization Failed")
                }

                let response = await controller_instance.handle()

                // Send the response down the wire as JSON
                if (response instanceof Renderable) {
                    let response_body = await response.render()
                    res.status(200).json(response_body)
                } else {
                    res.status(200).json()
                }
            } catch (e) {
                // Check if the error is not a Strontium HTTP error
                if (!(e instanceof HTTPError)) {
                    e = await this.handleError(e)

                    if (e === undefined) {
                        e = new InternalError()
                    }
                }

                // If the error is a Strontium HTTP error then format the error and set it down
                res.set(e.headers()).status(e.statusCode()).json(e.render())
                return
            }
        }
    }
}
