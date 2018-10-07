import { ValidationError } from "../../../errors/ValidationError"

export const isNumber = <I>(input: I): number | undefined => {
    if (input === undefined) {
        return input
    }

    if (typeof input === "number") {
        return input
    }

    throw new ValidationError(
        "IS_NUMBER",
        "Value must be a number",
        "This value must be a number."
    )
}
