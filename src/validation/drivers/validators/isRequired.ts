import { ValidationError } from "../../../errors/ValidationError"

export const isRequired = <I>(input?: I): Exclude<I, undefined> => {
    if (input !== undefined) {
        return input as Exclude<I, undefined>
    }

    throw new ValidationError(
        "IS_REQUIRED",
        "Value was undefined",
        "This value is required and cannot be undefined."
    )
}
