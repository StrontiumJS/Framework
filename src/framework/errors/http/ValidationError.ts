import { HTTPError } from "./HTTPError"
import { badRequest } from "boom"
import { ValidationError as JoiValidationError } from "joi"

/**
 * A ValidationError represents an error validating the input provided by the client to the server.
 *
 * This particular error is designed to be constructed using a Joi validation error which differentiates it from
 * the BadRequestError type.
 */
export class ValidationError extends HTTPError {
    constructor(error: JoiValidationError) {
        super(error.details[0].message)

        Object.setPrototypeOf(this, ValidationError.prototype)
    }

    render(): any {
        return badRequest(this.message).output.payload
    }

    statusCode(): number {
        return 400
    }
}
