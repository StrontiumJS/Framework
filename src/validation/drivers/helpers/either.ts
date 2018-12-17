import { ValidationError } from "../../../errors/http/ValidationError"
import { ValidatorFunction } from "../../abstract/ValidatorFunction"

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
    return async (i: I) => {
        let errors: Array<unknown> = []

        // Iterate over each validator in descending order until one succeeds.
        for (let validator of [V1, V2, V3, V4, V5]) {
            if (validator !== undefined) {
                try {
                    return await validator(i)
                } catch (e) {
                    errors.push(e)
                }
            }
        }

        // If we get to this stage then we have failed the validator - throw a Validation Error unless one of
        // the validators threw a different error type
        let failedConstraints: Array<string> = []
        let failedInternalMessages: Array<string> = []
        let failedExternalMessages: Array<string> = []
        let fieldPaths = []
        let validatorErrorMessages = ""

        for (let error of errors) {
            if (error instanceof ValidationError) {
                if (error.fieldPath) {
                    failedConstraints.push(`IS_OBJECT(${error.constraintName})`)
                } else {
                    failedConstraints.push(error.constraintName)
                }

                if (error.internalMessage) {
                    let internal = error.internalMessage
                    if (error.fieldPath) {
                        internal = `(Path: '${error.fieldPath}' ${
                            error.internalMessage
                        })`
                    }
                    failedInternalMessages.push(internal)
                }

                if (error.externalMessage) {
                    let external = error.externalMessage
                    if (error.fieldPath) {
                        external = `(Path: '${error.fieldPath}' ${
                            error.externalMessage
                        })`
                    }
                    failedExternalMessages.push(external)
                }
            } else {
                throw error
            }
        }

        throw new ValidationError(
            `EITHER(${failedConstraints.join(",")})`,
            `Either: (${failedInternalMessages.join(" | ")})`,
            `This value did not match any of the following validators: (${failedExternalMessages.join(
                " | "
            )})`
        )
    }
}
