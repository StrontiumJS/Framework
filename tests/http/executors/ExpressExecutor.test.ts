import { InternalError } from "../../../src/framework/errors/http/InternalError"
import { UnauthorizedError } from "../../../src/framework/errors/http/UnauthorizedError"
import * as Chai from "chai"
import * as ChaiSpies from "chai-spies"

import { ExpressExecutor } from "../../../src/framework/http/executors/ExpressExecutor"
import { TestController, TestResponse } from "./TestController"
import { Request, Response } from "express"

const MockExpressRequest = require("mock-express-request")
const MockExpressResponse = require("mock-express-response")

Chai.use(ChaiSpies)
const expect = Chai.expect

suite("Express Executor", () => {
    let executor: ExpressExecutor

    beforeEach(() => {
        executor = new ExpressExecutor()
    })

    suite("Extract", () => {
        test("The full express request and response object should be passed to the extract method", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            let test_spy = Chai.spy((req: Express.Request) => {})

            class controller extends TestController {
                public async extract(req: Express.Request): Promise<void> {
                    test_spy(req)
                }
            }

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect(test_spy).to.have.been.called.with(test_request)
        })

        test("If Extract throws an error then the process should be aborted and the error returned", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            class controller extends TestController {
                public async extract(req: Express.Request): Promise<void> {
                    throw new InternalError()
                }
            }

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect((test_response as any)._getJSON()).to.deep.equal({
                error: "Internal Server Error",
                message: "An internal server error occurred",
                statusCode: 500,
            })
        })
    })

    suite("Validate", () => {
        test("The validate method should be called", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            let test_spy = Chai.spy(() => {})

            class controller extends TestController {
                public async validate(): Promise<void> {
                    test_spy()
                }
            }

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect(test_spy).to.have.been.called()
        })
    })

    suite("Init", () => {
        test("The init method should be called", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            let test_spy = Chai.spy(() => {})

            class controller extends TestController {
                public async init(): Promise<void> {
                    test_spy()
                }
            }

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect(test_spy).to.have.been.called()
        })

        test("The default init method should return without error", async () => {
            let controller = new TestController()

            let result = await controller.init()

            expect(result).to.equal(undefined)
        })
    })

    suite("Authorize", () => {
        test("Execution should terminate with a 401 error if the authorization function returns false", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            let handle_spy = Chai.spy(() => {})

            class controller extends TestController {
                public async authorize(): Promise<boolean> {
                    return false
                }

                public async handle(): Promise<void> {
                    handle_spy()
                }
            }

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect(handle_spy).not.to.have.been.called()
            expect((test_response as any)._getJSON()).to.deep.equal({
                error: "Unauthorized",
                message: "Authorization Failed",
                statusCode: 401,
            })
            expect(test_response.statusCode).to.equal(401)
        })

        test("Execution should continue if the authorization function returns true", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            let handle_spy = Chai.spy(() => {})

            class controller extends TestController {
                public async authorize(): Promise<boolean> {
                    return true
                }

                public async handle(): Promise<void> {
                    handle_spy()
                }
            }

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect(handle_spy).to.have.been.called()
            expect((test_response as any)._getString()).to.equal("")
            expect(test_response.statusCode).to.equal(200)
        })
    })

    suite("Handler", async () => {
        test("The return value of the handler should be returned to the client", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            class controller extends TestController {
                public async handle(): Promise<TestResponse> {
                    return new TestResponse("Test Message")
                }
            }

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect((test_response as any)._getJSON()).to.deep.equal({
                message: "Test Message",
            })
            expect(test_response.statusCode).to.equal(200)
        })

        test("If the handler returns void then no body should be sent", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            class controller extends TestController {
                public async handle(): Promise<void> {
                    return
                }
            }

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect((test_response as any)._getString()).to.equal("")
            expect(test_response.statusCode).to.equal(200)
        })
    })

    suite("Error Handling", async () => {
        test("An error that is not a Strontium HTTP Error should be passed to the exception handler of the executor", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            let e = new Error("My test error")

            class controller extends TestController {
                public async handle(): Promise<void> {
                    throw e
                }
            }

            let error_spy = Chai.spy(async (e: Error) => {})
            executor.handleError = error_spy

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect(error_spy).to.have.been.called.with(e)
            expect((test_response as any)._getJSON()).to.deep.equal({
                error: "Internal Server Error",
                message: "An internal server error occurred",
                statusCode: 500,
            })
            expect(test_response.statusCode).to.equal(500)
        })

        test("If the error handler returns a Strontium HTTP Error that should be returned to the client instead", async () => {
            let test_request: Request = new MockExpressRequest()
            let test_response: Response = new MockExpressResponse()

            let e = new Error("My test error")

            class controller extends TestController {
                public async handle(): Promise<void> {
                    throw e
                }
            }

            let error_spy = Chai.spy(async (e: Error) => {
                return new UnauthorizedError("Access Prohibited")
            })
            executor.handleError = error_spy

            let middleware = executor.middleware(controller)
            await middleware(test_request, test_response)

            expect(error_spy).to.have.been.called.with(e)
            expect((test_response as any)._getJSON()).to.deep.equal({
                error: "Unauthorized",
                message: "Access Prohibited",
                statusCode: 401,
            })
            expect(test_response.statusCode).to.equal(401)
        })

        test("The default error handler should log the error to console.error", async () => {
            let original_error = console["error"]

            try {
                let error_spy = Chai.spy((e: Error) => {})
                console.error = error_spy

                let test_request: Request = new MockExpressRequest()
                let test_response: Response = new MockExpressResponse()

                let e = new Error("My test error")

                class controller extends TestController {
                    public async handle(): Promise<void> {
                        throw e
                    }
                }

                let middleware = executor.middleware(controller)
                await middleware(test_request, test_response)

                expect(error_spy).to.have.been.called.with(e)
            } finally {
                console.error = original_error
            }
        })
    })
})
