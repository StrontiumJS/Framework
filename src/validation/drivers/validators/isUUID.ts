import { ValidationError } from "../../../errors"
import { UUID } from "../../../utils/types"

import { isUUID as uuidValidator } from "validator"

export const isUUID = (i: unknown): UUID => {
    if (typeof i === "string" && uuidValidator(i)) {
        return i
    }

    throw new ValidationError(
        "IS_UUID",
        "Value must be a UUID V4",
        "This value must be a UUID V4"
    )
}
