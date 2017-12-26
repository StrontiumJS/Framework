import { HTTPError } from "./HTTPError"
import { unauthorized } from "boom"

/**
 * An UnauthorizedError means that the server was unable to validate the authentication details provided by the Client.
 */
export class UnauthorizedError extends HTTPError {
    constructor(m: string) {
        super(m)

        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }

    render(): any {
        return unauthorized(this.message).output.payload
    }

    statusCode(): number {
        return 401
    }
}
