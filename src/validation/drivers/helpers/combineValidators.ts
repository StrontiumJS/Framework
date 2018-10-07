import {
    AsyncValidator,
    ValidatorFunction,
} from "../../abstract/ValidatorFunction"

export function combineValidators<I, O1, O2>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<O1, O2>
): AsyncValidator<unknown, O2>
export function combineValidators<I, O1, O2, O3>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<O1, O2>,
    V3: ValidatorFunction<O2, O3>
): AsyncValidator<unknown, O3>
export function combineValidators<I, O1, O2, O3, O4>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<O1, O2>,
    V3: ValidatorFunction<O2, O3>,
    V4: ValidatorFunction<O3, O4>
): AsyncValidator<unknown, O4>
export function combineValidators<I, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<O1, O2>,
    V3: ValidatorFunction<O2, O3>,
    V4: ValidatorFunction<O3, O4>,
    V5: ValidatorFunction<O4, O5>
): AsyncValidator<unknown, O5>

export function combineValidators<I, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<O1, O2>,
    V3?: ValidatorFunction<O2, O3>,
    V4?: ValidatorFunction<O3, O4>,
    V5?: ValidatorFunction<O4, O5>
):
    | AsyncValidator<I, O2>
    | AsyncValidator<I, O3>
    | AsyncValidator<I, O4>
    | AsyncValidator<I, O5> {
    // This is split into if statements so Type completion is rigid. It's possible this could
    // be better written in the future but for now TypeScript is happy.
    if (V5 !== undefined && V4 !== undefined && V3 !== undefined) {
        return async (i: I) => {
            let r1 = await V1(i)
            let r2 = await V2(r1)
            let r3 = await V3(r2)
            let r4 = await V4(r3)
            return await V5(r4)
        }
    } else if (V4 !== undefined && V3 !== undefined) {
        return async (i: I) => {
            let r1 = await V1(i)
            let r2 = await V2(r1)
            let r3 = await V3(r2)
            return await V4(r3)
        }
    } else if (V3 !== undefined) {
        return async (i: I) => {
            let r1 = await V1(i)
            let r2 = await V2(r1)
            return await V3(r2)
        }
    } else {
        return async (i: I) => {
            let r1 = await V1(i)
            return await V2(r1)
        }
    }
}
