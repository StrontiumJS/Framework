import { expect } from "chai"
import { combineValidators } from "../../../../src/validation/drivers/helpers/combineValidators"
import {
    ValidatorFunction,
    ValidatorOutput,
    isRequired,
} from "../../../../src/validation"

describe("combineValidators", () => {
    describe("Two Validators", () => {
        it("should apply two validators to a value sequentially and throw the first error encountered", async () => {
            let testCombiner = async <I, O1, O2>(
                input: I,
                V1: ValidatorFunction<I, O1>,
                V2: ValidatorFunction<O1, O2>
            ): Promise<O2> => {
                let o1: O1 = await V1(input)
                let o2: O2 = await V2(o1)
                return o2
            }

            let validator: Promise<string> = testCombiner(
                "test",
                isRequired,
                isRequired
            )

            let test: string | undefined
            // Type test
            let test1: ValidatorFunction<
                number | undefined,
                number
            > = isRequired
            let test2: string = validator(test)

            let test3: ValidatorOutput<unknown, typeof validator> = "test"
        })
    })

    describe("Three Validators")

    describe("Four Validators")

    describe("Five Validators")
})
