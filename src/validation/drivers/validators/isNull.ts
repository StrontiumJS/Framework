import { ValidationError } from "../../../errors/ValidationError"

export const isNull = (input?: unknown): null | undefined => {
    if (input === undefined) {
        return undefined
    }

    if (input === null) {
        return null
    }

    throw new ValidationError(
        "IS_NULL",
        "Value was not null",
        "This value must be `null`. It's possible you sent undefined, no value or the string null instead."
    )
}
