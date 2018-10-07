import { ValidatorFunction } from "../../abstract/ValidatorFunction"

export function combineValidators<I1, O1, O2>(
    V1: ValidatorFunction<I1, O1>,
    V2: ValidatorFunction<O1, O2>
): (input: unknown) => Promise<O2>
export function combineValidators<I1, O1, O2, O3>(
    V1: ValidatorFunction<I1, O1>,
    V2: ValidatorFunction<O1, O2>,
    V3: ValidatorFunction<O2, O3>
): (input: unknown) => Promise<O3>
export function combineValidators<I1, O1, O2, O3, O4>(
    V1: ValidatorFunction<I1, O1>,
    V2: ValidatorFunction<O1, O2>,
    V3: ValidatorFunction<O2, O3>,
    V4: ValidatorFunction<O3, O4>
): (input: unknown) => Promise<O4>
export function combineValidators<I1, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I1, O1>,
    V2: ValidatorFunction<O1, O2>,
    V3: ValidatorFunction<O2, O3>,
    V4: ValidatorFunction<O3, O4>,
    V5: ValidatorFunction<O4, O5>
): (input: unknown) => Promise<O5>
export function combineValidators<I1, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I1, O1>,
    V2: ValidatorFunction<O1, O2>,
    V3?: ValidatorFunction<O2, O3>,
    V4?: ValidatorFunction<O3, O4>,
    V5?: ValidatorFunction<O4, O5>
):
    | ((input: I1) => Promise<O2>)
    | ((input: I1) => Promise<O3>)
    | ((input: I1) => Promise<O4>)
    | ((input: I1) => Promise<O5>) {
    // This is split into if statements so Type completion is rigid. It's possible this could
    // be better written in the future but for now TypeScript is happy.
    if (V5 !== undefined && V4 !== undefined && V3 !== undefined) {
        return async (i: I1) => {
            let r1 = await V1(i)
            let r2 = await V2(r1)
            let r3 = await V3(r2)
            let r4 = await V4(r3)
            return await V5(r4)
        }
    } else if (V4 !== undefined && V3 !== undefined) {
        return async (i: I1) => {
            let r1 = await V1(i)
            let r2 = await V2(r1)
            let r3 = await V3(r2)
            return await V4(r3)
        }
    } else if (V3 !== undefined) {
        return async (i: I1) => {
            let r1 = await V1(i)
            let r2 = await V2(r1)
            return await V3(r2)
        }
    } else {
        return async (i: I1) => {
            let r1 = await V1(i)
            return await V2(r1)
        }
    }
}
