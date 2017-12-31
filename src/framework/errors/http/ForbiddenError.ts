import { HTTPError } from "./HTTPError"
import { forbidden } from "boom"

/**
 * A ForbiddenError means that the requesting entity does not have permission to access the requested entity or action.
 */
export class ForbiddenError extends HTTPError {
    constructor(m: string = "Access Forbidden") {
        super(m)

        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }

    render(): any {
        return forbidden(this.message).output.payload
    }

    statusCode(): number {
        return 403
    }
}
