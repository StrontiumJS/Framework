import { ValidationError } from "../../../errors/ValidationError"

export const isRequired = <I>(input?: I): I => {
    if (input !== undefined) {
        return input as Exclude<I, undefined>
    }

    throw new ValidationError(
        "IS_REQUIRED",
        "Value was undefined",
        "This value is required and cannot be undefined."
    )
}
