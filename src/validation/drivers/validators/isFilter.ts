import { either } from "../helpers/either"
import { Filter } from "../../../query"

import {
    ObjectValidator,
    ValidatedObject,
    ValidatorFunction,
    isArray,
    isObject,
    isUndefined,
} from "../.."

export const isFilter = <V extends ObjectValidator>(
    objectSchema: V,
    depth: number = 0
): ((i: unknown) => Promise<Filter<ValidatedObject<V>>>) => {
    if (depth > 10) {
        // Stub this to any as it is a library operational detail and would pollute the type system
        return undefined as any
    }

    let validatorObject: { [key: string]: ValidatorFunction<any, any> } = {
        $and: either(isUndefined, isArray(isFilter(objectSchema, depth + 1))),
        $or: either(isUndefined, isArray(isFilter(objectSchema, depth + 1))),
    }

    for (let key of Object.keys(objectSchema)) {
        validatorObject[key] = isFieldSelector(objectSchema[key])
    }

    // Flag as any so that TypeScript doesn't get scared about the use of a recursive builder function
    return isObject(validatorObject) as any
}

const isFieldSelector = (keyValidator: ValidatorFunction<any, any>) =>
    either(
        isUndefined,
        keyValidator,
        isObject({
            $in: either(isUndefined, isArray(keyValidator)),
            $nin: either(isUndefined, isArray(keyValidator)),
            $eq: either(isUndefined, keyValidator),
            $neq: either(isUndefined, keyValidator),
            $gt: either(isUndefined, keyValidator),
            $gte: either(isUndefined, keyValidator),
            $lt: either(isUndefined, keyValidator),
            $lte: either(isUndefined, keyValidator),
            $contains: either(isUndefined, keyValidator),
            $arr_contains: either(isUndefined, keyValidator),
        })
    )
