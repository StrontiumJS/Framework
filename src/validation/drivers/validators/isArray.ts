import { ValidationError } from "../../../errors"

import { ValidatorFunction, ValidatorOutput } from "../.."

export const isArray = <V extends ValidatorFunction<any, any>>(
    innerValidator: V
) => async (input: unknown): Promise<Array<ValidatorOutput<unknown, V>>> => {
    if (!Array.isArray(input)) {
        throw new ValidationError(
            "IS_ARRAY",
            "Value not an array",
            "This value must be an array."
        )
    }

    let validatedArray: Array<ValidatorOutput<unknown, V>> = await Promise.all(
        input.map(innerValidator)
    )

    return validatedArray
}
