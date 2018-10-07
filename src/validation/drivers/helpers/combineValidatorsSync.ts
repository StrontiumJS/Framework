import { SyncValidator } from "../../abstract/ValidatorFunction"

export function combineValidatorsSync<I, O1, O2>(
    V1: SyncValidator<I, O1>,
    V2: SyncValidator<O1, O2>
): SyncValidator<unknown, O2>
export function combineValidatorsSync<I, O1, O2, O3>(
    V1: SyncValidator<I, O1>,
    V2: SyncValidator<O1, O2>,
    V3: SyncValidator<O2, O3>
): SyncValidator<unknown, O3>
export function combineValidatorsSync<I, O1, O2, O3, O4>(
    V1: SyncValidator<I, O1>,
    V2: SyncValidator<O1, O2>,
    V3: SyncValidator<O2, O3>,
    V4: SyncValidator<O3, O4>
): SyncValidator<unknown, O4>
export function combineValidatorsSync<I, O1, O2, O3, O4, O5>(
    V1: SyncValidator<I, O1>,
    V2: SyncValidator<O1, O2>,
    V3: SyncValidator<O2, O3>,
    V4: SyncValidator<O3, O4>,
    V5: SyncValidator<O4, O5>
): SyncValidator<unknown, O5>

export function combineValidatorsSync<I, O1, O2, O3, O4, O5>(
    V1: SyncValidator<I, O1>,
    V2: SyncValidator<O1, O2>,
    V3?: SyncValidator<O2, O3>,
    V4?: SyncValidator<O3, O4>,
    V5?: SyncValidator<O4, O5>
):
    | SyncValidator<I, O2>
    | SyncValidator<I, O3>
    | SyncValidator<I, O4>
    | SyncValidator<I, O5> {
    // This is split into if statements so Type completion is rigid. It's possible this could
    // be better written in the future but for now TypeScript is happy.
    if (V5 !== undefined && V4 !== undefined && V3 !== undefined) {
        return (i: I) => {
            let r1 = V1(i)
            let r2 = V2(r1)
            let r3 = V3(r2)
            let r4 = V4(r3)
            return V5(r4)
        }
    } else if (V4 !== undefined && V3 !== undefined) {
        return (i: I) => {
            let r1 = V1(i)
            let r2 = V2(r1)
            let r3 = V3(r2)
            return V4(r3)
        }
    } else if (V3 !== undefined) {
        return (i: I) => {
            let r1 = V1(i)
            let r2 = V2(r1)
            return V3(r2)
        }
    } else {
        return (i: I) => {
            let r1 = V1(i)
            return V2(r1)
        }
    }
}
