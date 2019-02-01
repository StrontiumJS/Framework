import { ValidationError } from "../../../errors/http/ValidationError"

export const isNumber = (input?: unknown): number => {
    if (typeof input === "number" && !isNaN(input)) {
        return input
    }

    if (typeof input === "string") {
        let parsedNumber = Number(input)

        if (!isNaN(parsedNumber)) {
            return parsedNumber
        }
    }

    throw new ValidationError(
        "IS_NUMBER",
        "Value not a number",
        "This value must be a number."
    )
}
