import { ValidationError } from "../../../errors"
import { isBase64 } from "validator"

export const isBase64EncodedString = (i: string): string => {
    if (isBase64(i)) {
        return i
    }

    throw new ValidationError(
        "IS_BASE_64",
        "Value is not a Base64 string",
        "This value is not a Base64 string"
    )
}
