import { HTTPError } from "./HTTPError"

export class InternalServerError extends HTTPError {
    constructor() {
        super(
            500,
            "An internal error occurred. The system administrator has been notified.",
            "Internal Error occurred."
        )

        Object.setPrototypeOf(this, InternalServerError.prototype)
    }
}
