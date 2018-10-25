import { ValidationError } from "../../../errors"

export const isUndefined = (input?: unknown): undefined => {
    if (input === undefined) {
        return undefined
    }

    throw new ValidationError(
        "IS_UNDEFINED",
        "Value not undefined",
        "This value must be undefined."
    )
}
