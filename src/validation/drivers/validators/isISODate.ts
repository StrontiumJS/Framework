import { ValidationError } from "../../../errors/ValidationError"
import * as Validator from "validator"

export const isISODate = (input?: unknown): Date | undefined => {
    if (input === undefined) {
        return undefined
    }

    if (Validator.isISO8601(String(input))) {
        return new Date(String(input))
    } else {
        throw new ValidationError(
            "IS_ISO_8601",
            "Value not an ISO Date",
            "This value must be a valid ISO 8601 Date string."
        )
    }
}
