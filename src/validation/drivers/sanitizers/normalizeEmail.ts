import { ValidationError } from "../../../errors/http/ValidationError"
import * as Validator from "validator"
import NormalizeEmailOptions = ValidatorJS.NormalizeEmailOptions

export const normalizeEmail = (options?: NormalizeEmailOptions) => <I>(
    input: I
): string => {
    let normalizedEmail = Validator.normalizeEmail(String(input), options)
    let isValid = Validator.isEmail(String(normalizedEmail), {
        ignore_max_length: true,
    } as any)

    if (isValid && typeof normalizedEmail === "string") {
        return normalizedEmail
    } else {
        throw new ValidationError(
            "NORMALIZE_EMAIL",
            "Invalid Email provided",
            "This value must be a valid email address."
        )
    }
}
