import { ValidationError } from "../../../errors/http/ValidationError"

export const isString = (input?: unknown): string => {
    if (typeof input === "string") {
        return input
    }

    throw new ValidationError(
        "IS_STRING",
        "Value not a string",
        "This value must be a string."
    )
}
