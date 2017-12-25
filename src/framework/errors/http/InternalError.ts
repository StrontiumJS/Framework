import { HTTPError } from "./HTTPError"
import { internal } from "boom"

/**
 * An UnauthorizedError means that the server was unable to validate the authentication details provided by the Client.
 */
export class InternalError extends HTTPError {
    constructor() {
        super()

        Object.setPrototypeOf(this, InternalError.prototype)
    }

    render(): any {
        return internal().output.payload
    }

    status_code(): number {
        return 500
    }
}
