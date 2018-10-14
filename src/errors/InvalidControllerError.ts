import { StrontiumError } from "./StrontiumError"

/**
 * An InvalidControllerError represents a Controller that has been provided to a HTTP Server implementation erroneously.
 *
 * This may occur if the Controller is malformed or un-buildable.
 */
export class InvalidControllerError extends StrontiumError {
    constructor(route: string) {
        super(
            `The controller provided for the route (${route}) is invalid. Please double check that it is Injectable and is registered correctly with the Web Server.`
        )
    }
}
