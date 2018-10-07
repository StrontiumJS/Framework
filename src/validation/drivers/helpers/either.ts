import { ValidatorFunction } from "../.."

export function either<I, O1, O2>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>
): (input: unknown) => Promise<O1 | O2>
export function either<I, O1, O2, O3>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3: ValidatorFunction<I, O3>
): (input: unknown) => Promise<O1 | O2 | O3>
export function either<I, O1, O2, O3, O4>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3: ValidatorFunction<I, O3>,
    V4: ValidatorFunction<I, O4>
): (input: unknown) => Promise<O1 | O2 | O3 | O4>
export function either<I, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3: ValidatorFunction<I, O3>,
    V4: ValidatorFunction<I, O4>,
    V5: ValidatorFunction<I, O5>
): (input: unknown) => Promise<O1 | O2 | O3 | O4 | O5>
export function either<I, O1, O2, O3, O4, O5>(
    V1: ValidatorFunction<I, O1>,
    V2: ValidatorFunction<I, O2>,
    V3?: ValidatorFunction<I, O3>,
    V4?: ValidatorFunction<I, O4>,
    V5?: ValidatorFunction<I, O5>
):
    | ((input: I) => Promise<O1 | O2>)
    | ((input: I) => Promise<O1 | O2 | O3>)
    | ((input: I) => Promise<O1 | O2 | O3 | O4>)
    | ((input: I) => Promise<O1 | O2 | O3 | O4 | O5>) {}
