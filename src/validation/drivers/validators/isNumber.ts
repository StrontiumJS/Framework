import { ValidationError } from "../../../errors/http/ValidationError"

export const isNumber = (input?: unknown): number => {
    if (typeof input === "number") {
        return input
    }

    throw new ValidationError(
        "IS_NUMBER",
        `Value ${input} not a number`,
        "This value must be a number."
    )
}
