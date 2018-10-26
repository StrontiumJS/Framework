import { ValidationError } from "../../../errors"

export const isExactly = <V extends Array<O>, O>(values: V) => (
    i: unknown
): O => {
    for (let value of values) {
        if (value === i) {
            return value
        }
    }

    throw new ValidationError(
        "IS_EXACTLY",
        "Value not in permitted set",
        `The provided value was not allowed for this field. Allowed values are: '${values.join(
            "', '"
        )}'`
    )
}
