import { ValidationError } from "../../../errors/ValidationError"

export const isRequired = <I>(input?: I): I => {
    if (input === undefined) {
        throw new ValidationError(
            "REQUIRED",
            "Required Value",
            "This field cannot be undefined."
        )
    }

    return input
}
