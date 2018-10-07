import { ValidationError } from "../../../errors/ValidationError"
import Validator from "validator"
import NormalizeEmailOptions = ValidatorJS.NormalizeEmailOptions

export const normalizeEmail = (options?: NormalizeEmailOptions) => <I>(
    input: I
): string | undefined => {
    if (input === undefined) {
        return input
    }

    let validatedEmail = Validator.normalizeEmail(String(input), options)

    if (validatedEmail !== false) {
        return validatedEmail
    } else {
        throw new ValidationError(
            "NORMALIZE_EMAIL",
            "Invalid Email provided",
            "This value must be a valid email address."
        )
    }
}
