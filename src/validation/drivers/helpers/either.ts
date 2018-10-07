import {
    AsyncValidator,
    ValidatorFunction,
} from "../../abstract/ValidatorFunction"

export function either<I, O1, O2>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>
): AsyncValidator<unknown, O1 | O2>
export function either<I, O1, O2, O3>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3: ValidatorFunction<I, O3>
): AsyncValidator<unknown, O1 | O2 | O3>
export function either<I, O1, O2, O3, O4>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3: ValidatorFunction<I, O3>,
    V4: ValidatorFunction<I, O4>
): AsyncValidator<unknown, O1 | O2 | O3 | O4>
export function either<I, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3: ValidatorFunction<I, O3>,
    V4: ValidatorFunction<I, O4>,
    V5: ValidatorFunction<I, O5>
): AsyncValidator<unknown, O1 | O2 | O3 | O4 | O5>

export function either<I, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3?: ValidatorFunction<I, O3>,
    V4?: ValidatorFunction<I, O4>,
    V5?: ValidatorFunction<I, O5>
):
    | AsyncValidator<I, O1 | O2>
    | AsyncValidator<I, O1 | O2 | O3>
    | AsyncValidator<I, O1 | O2 | O3 | O4>
    | AsyncValidator<I, O1 | O2 | O3 | O4 | O5> {
    // This is split into if statements so Type completion is rigid. It's possible this could
    // be better written in the future but for now TypeScript is happy.
    if (V5 !== undefined && V4 !== undefined && V3 !== undefined) {
        return async (i: I) => {
            let [o1, o2, o3, o4, o5] = await Promise.all([
                V1(i),
                V2(i),
                V3(i),
                V4(i),
                V5(i),
            ])
            return o1 || o2 || o3 || o4 || o5
        }
    } else if (V4 !== undefined && V3 !== undefined) {
        return async (i: I) => {
            let [o1, o2, o3, o4] = await Promise.all([
                V1(i),
                V2(i),
                V3(i),
                V4(i),
            ])
            return o1 || o2 || o3 || o4
        }
    } else if (V3 !== undefined) {
        return async (i: I) => {
            let [o1, o2, o3] = await Promise.all([V1(i), V2(i), V3(i)])
            return o1 || o2 || o3
        }
    } else {
        return async (i: I) => {
            let [o1, o2] = await Promise.all([V1(i), V2(i)])
            return o1 || o2
        }
    }
}
