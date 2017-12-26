import { HTTPError } from "./HTTPError"
import { notFound } from "boom"

/**
 * A NotFoundError means that the requested content was not found.
 *
 * This maps to the common 404 status code found in many web APIs.
 */
export class NotFoundError extends HTTPError {
    constructor(m: string = "Content Not Found") {
        super(m)

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    render(): any {
        return notFound(this.message).output.payload
    }

    statusCode(): number {
        return 404
    }
}
