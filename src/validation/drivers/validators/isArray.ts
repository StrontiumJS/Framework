import { ValidationError } from "../../../errors"

import { ValidatorFunction } from "../.."

export const isArray = <V extends ValidatorFunction<unknown, O>, O>(
    innerValidator: V
) => async (input: unknown): Promise<Array<O>> => {
    if (!Array.isArray(input)) {
        throw new ValidationError(
            "IS_ARRAY",
            "Value not an array",
            "This value must be an array."
        )
    }

    let validatedArray: Array<O> = await Promise.all(input.map(innerValidator))

    return validatedArray
}
