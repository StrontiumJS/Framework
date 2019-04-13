import { ValidationError } from "../../../errors"

import { ValidatorFunction } from "../.."

export const isDictionary = <V>(
    keyValidator: ValidatorFunction<any, string>,
    valueValidator: ValidatorFunction<any, V>
) => async (
    i: unknown
): Promise<{
    [index: string]: V
}> => {
    if (typeof i !== "object" || i === null) {
        throw new ValidationError(
            "IS_OBJECT",
            "Object validation failed",
            "This value should be an object."
        )
    }

    let response: {
        [index: string]: V
    } = {}
    for (let p in i) {
        if (i.hasOwnProperty(p)) {
            let validatedKey = await keyValidator(p)

            // Sadly ts-ignore this as TS doesn't understand that we have strongly ensured
            // that this property is present.
            // @ts-ignore
            let rawValue = i[p]

            let validatedOutput = await valueValidator(rawValue)

            if (validatedOutput !== undefined) {
                response[validatedKey] = validatedOutput
            }
        }
    }

    return response
}
