import { Renderable } from "./Renderable"
import { ValidationError } from "../errors/http/ValidationError"
import { IncomingMessage } from "http"
import { injectable } from "inversify"
import { validate as ZaifroValidate } from "zafiro-validators"

/**
 * An EndpointController represents a REST Endpoint in the API which can be executed with a given request context to
 * produce a result, R, which is then rendered and returned to the client.
 *
 * EndpointController's provide a functional blueprint for how a request should be executed but are not themselves
 * able to execute such a request. Instead an Executor, such as the Express Executor, will call the Controller
 * according to the agreed execution order. This is as follows:
 *
 * Extract -> Init -> Validate -> Authorize -> Handle
 */
@injectable()
export abstract class EndpointController<R extends Renderable | void> {
    /**
     * This is an extraction phase from the HTTP request where any data required by the Endpoint from the inbound
     * request should be extracted.
     *
     * This should be used to retrieve relevant data from the body of the request. For example it could be used to
     * retrieve the JSON post body, store header values, load references to datastores or store context provided by
     * middleware such as authentication status.
     *
     * The extraction phase itself is not meant to handle any logic - it is simply designed to pull relevant data from
     * the request to facilitate onwards execution and processing.
     *
     * In unit testing it is often helpful to ignore this function in favour of directly setting the values to test
     * the functionality of certain aspects of the endpoint controller.
     *
     * @param {Request} request
     */
    public abstract async extract(request: IncomingMessage): Promise<void>
    public abstract async extract<T extends IncomingMessage>(
        request: T
    ): Promise<void>

    /**
     * The init function is run after the extraction phase of the request and is designed to run elements of the controller
     * that are not directly extracted from the request.
     *
     * Examples include initializing a Repository or calculating a derived value from an input variable.
     *
     * This is split into it's own phase simply to allow testing of what would otherwise be a rather opaque area of the
     * application lifecycle.
     *
     * This stage is run prior to validation to allow derived input's to be subsequently validated. As such it is important
     * to take care when using values here as they have not yet been rendered safe for use.
     */
    public async init(): Promise<void> {
        return
    }

    /**
     * Validate the input and state of the Endpoint Controller prior to beginning to execute the handler function.
     *
     * This is used to provide input validation and scrubbing as well as integrity checking of the initialization state.
     *
     * The executor will call this function and will expect it to throw an error if the contents of the execution are
     * not valid.
     */
    public async validate(): Promise<void> {
        let validation_result = ZaifroValidate(this)

        if (validation_result.error !== null) {
            throw new ValidationError(validation_result.error)
        } else {
            Object.assign(this, validation_result.value)
        }
    }

    /**
     * Authorize that the calling Actor is eligible to perform the stated request on the presented resources.
     *
     * This call requires a true response to proceed with execution. Anything other than a true response will be treated
     * as a rejection and will present an UnauthorizedError to the end user.
     */
    public abstract async authorize(): Promise<boolean>

    /**
     * Process the request represented by the controller.
     * If the function continues to execution without fault then the response value will be returned to the end user.
     * Response values should ideally be a Renderable object.
     *
     * In the event that the execution encounters an error it should throw an Error which will be caught, logged and
     * returned to the client as a 500. HTTP Errors from Strontium are the exception to this which are formatted
     * nicely and returned to the user with the correct error code for the representative error.
     *
     * @returns {any}
     */
    public abstract async handle(): Promise<R>
}

/**
 * An EndpointControllerConstructor represents a function capable of constructing an EndpointController.
 *
 * It is used internally by the framework to pass references to a particular Controller's constructor.
 */
export interface EndpointControllerConstructor {
    new (): EndpointController<any>
}
