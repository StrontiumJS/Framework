import { ValidationError } from "../../../errors/http/ValidationError"

export const isBoolean = (input?: unknown): boolean => {
    if (typeof input === "boolean") {
        return input
    }

    throw new ValidationError(
        "IS_BOOLEAN",
        "Value not a boolean",
        "This value must be a boolean."
    )
}
