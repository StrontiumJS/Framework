import { ValidationError } from "../../../errors/ValidationError"
import { ValidatorFunction } from "../../abstract/ValidatorFunction"
import { compact } from "../../../utils/list"

export function either<I, O1, O2>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>
): ValidatorFunction<I, O1 | O2>
export function either<I, O1, O2, O3>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3: ValidatorFunction<I, O3>
): ValidatorFunction<I, O1 | O2 | O3>
export function either<I, O1, O2, O3, O4>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3: ValidatorFunction<I, O3>,
    V4: ValidatorFunction<I, O4>
): ValidatorFunction<I, O1 | O2 | O3 | O4>
export function either<I, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3: ValidatorFunction<I, O3>,
    V4: ValidatorFunction<I, O4>,
    V5: ValidatorFunction<I, O5>
): ValidatorFunction<I, O1 | O2 | O3 | O4 | O5>

export function either<I, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3?: ValidatorFunction<I, O3>,
    V4?: ValidatorFunction<I, O4>,
    V5?: ValidatorFunction<I, O5>
):
    | ValidatorFunction<I, O1 | O2>
    | ValidatorFunction<I, O1 | O2 | O3>
    | ValidatorFunction<I, O1 | O2 | O3 | O4>
    | ValidatorFunction<I, O1 | O2 | O3 | O4 | O5> {
    // This is split into if statements so Type completion is rigid. It's possible this could
    // be better written in the future but for now TypeScript is happy.
    if (V5 !== undefined && V4 !== undefined && V3 !== undefined) {
        return async (i: I) => {
            let outputs = await Promise.all([
                runAndWrap(i, V1),
                runAndWrap(i, V2),
                runAndWrap(i, V3),
                runAndWrap(i, V4),
                runAndWrap(i, V5),
            ])
            let [o1, o2, o3, o4, o5] = outputs
            let eitherValue =
                o1.value || o2.value || o3.value || o4.value || o5.value
            if (eitherValue !== undefined) {
                return eitherValue
            } else {
                throw new ValidationError(
                    "EITHER",
                    buildEitherErrorMessage(outputs),
                    "This value did not match any validators."
                )
            }
        }
    } else if (V4 !== undefined && V3 !== undefined) {
        return async (i: I) => {
            let outputs = await Promise.all([
                runAndWrap(i, V1),
                runAndWrap(i, V2),
                runAndWrap(i, V3),
                runAndWrap(i, V4),
            ])
            let [o1, o2, o3, o4] = outputs
            let eitherValue = o1.value || o2.value || o3.value || o4.value
            if (eitherValue !== undefined) {
                return eitherValue
            } else {
                throw new ValidationError(
                    "EITHER",
                    buildEitherErrorMessage(outputs),
                    "This value did not match any validators."
                )
            }
        }
    } else if (V3 !== undefined) {
        return async (i: I) => {
            let outputs = await Promise.all([
                runAndWrap(i, V1),
                runAndWrap(i, V2),
                runAndWrap(i, V3),
            ])
            let [o1, o2, o3] = outputs
            let eitherValue = o1.value || o2.value || o3.value
            if (eitherValue !== undefined) {
                return eitherValue
            } else {
                throw new ValidationError(
                    "EITHER",
                    buildEitherErrorMessage(outputs),
                    "This value did not match any validators."
                )
            }
        }
    } else {
        return async (i: I) => {
            let outputs = await Promise.all([
                runAndWrap(i, V1),
                runAndWrap(i, V2),
            ])
            let [o1, o2] = outputs
            let eitherValue = o1.value || o2.value
            if (eitherValue !== undefined) {
                return eitherValue
            } else {
                throw new ValidationError(
                    "EITHER",
                    buildEitherErrorMessage(outputs),
                    "This value did not match any validators."
                )
            }
        }
    }
}

interface WrappedValidatorOutput<O> {
    value?: O
    err?: ValidationError
}

// Used internally to catch validation errors and return undefined
async function runAndWrap<I, O>(
    input: I,
    validator: ValidatorFunction<I, O>
): Promise<WrappedValidatorOutput<O>> {
    try {
        return { value: await validator(input) }
    } catch (e) {
        return { err: e }
    }
}

function buildEitherErrorMessage(
    outputs: WrappedValidatorOutput<any>[]
): string {
    return compact(outputs.map(({ err }) => err && err.systemMessage)).join(
        ", "
    )
}
