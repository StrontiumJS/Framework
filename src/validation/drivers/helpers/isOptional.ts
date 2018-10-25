import { either } from "./either"
import { isUndefined } from "../validators/isUndefined"

import { ValidatorFunction } from "../.."

export const isOptional = <V extends ValidatorFunction<I, O>, I, O>(
    validator: V
) => either(isUndefined, validator)
