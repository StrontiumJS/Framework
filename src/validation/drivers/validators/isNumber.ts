import { ValidationError } from "../../../errors/ValidationError"

export const isNumber = (input?: unknown): number | undefined => {
    if (input === undefined) {
        return undefined
    }

    if (typeof input === "number") {
        return input
    }

    throw new ValidationError(
        "IS_NUMBER",
        "Value not a number",
        "This value must be a number."
    )
}
