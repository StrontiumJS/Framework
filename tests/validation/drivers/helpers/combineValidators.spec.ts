import { expect } from "chai"
import {
    ValidationError,
    combineValidators,
    isISOAlpha2CountryCode,
    isNumber,
    isString,
} from "../../../../src"

describe("combineValidators", () => {
    describe("Two Validators", () => {
        it("should apply two validators to a value sequentially and throw the first error encountered", async () => {
            let testVariable: string | undefined

            // Type test
            let testValidator = combineValidators(
                isString,
                isISOAlpha2CountryCode
            )

            try {
                // This useless variable is defined only to ensure type consistency
                let testOutput: string = await testValidator(testVariable)
                expect(false).to.equal(true)
            } catch (e) {
                expect(e instanceof ValidationError).to.equal(true)
                expect(e.message === "Value was undefined")
            }
        })

        it("should correctly apply the validations in the sequence provided", async () => {
            let testVariable: string | undefined = "GB"

            // Type test
            let testValidator = combineValidators(
                isString,
                isISOAlpha2CountryCode
            )

            let testOutput: string = await testValidator(testVariable)
            expect(testOutput).to.equal("GB")
        })
    })

    describe("Three Validators", () => {
        it("should apply three validators to a value sequentially and throw the first error encountered", async () => {
            let testVariable: string | undefined

            // Type test
            let testValidator = combineValidators(
                isString,
                isISOAlpha2CountryCode,
                (i): "test" => {
                    throw new ValidationError(
                        "TEST_CONSTRAINT",
                        "This is a test"
                    )
                }
            )

            try {
                // This useless variable is defined only to ensure type consistency
                let testOutput: "test" = await testValidator(testVariable)
                expect(false).to.equal(true)
            } catch (e) {
                expect(e instanceof ValidationError).to.equal(true)
                expect(e.message === "Value was undefined")
            }
        })

        it("should correctly apply the validations in the sequence provided", async () => {
            let testVariable: string | undefined = "GB"

            // Type test
            let testValidator = combineValidators(
                isString,
                isISOAlpha2CountryCode,
                (i): "test" => "test"
            )

            let testOutput: string = await testValidator(testVariable)
            expect(testOutput).to.equal("test")
        })
    })

    describe("Four Validators", () => {
        it("should apply four validators to a value sequentially and throw the first error encountered", async () => {
            let testVariable: number | undefined

            // Type test
            let testValidator = combineValidators(
                isString,
                isISOAlpha2CountryCode,
                (i) => i,
                (i): "test" => {
                    throw new ValidationError(
                        "TEST_CONSTRAINT",
                        "This is a test"
                    )
                }
            )

            try {
                // This useless variable is defined only to ensure type consistency
                let testOutput: "test" = await testValidator(testVariable)
                expect(false).to.equal(true)
            } catch (e) {
                expect(e instanceof ValidationError).to.equal(true)
                expect(e.message === "Value was undefined")
            }
        })

        it("should correctly apply the validations in the sequence provided", async () => {
            let testVariable: string | undefined = "GB"

            // Type test
            let testValidator = combineValidators(
                isString,
                isISOAlpha2CountryCode,
                (i): "test" => "test",
                (i): "other test" => "other test"
            )

            let testOutput: string = await testValidator(testVariable)
            expect(testOutput).to.equal("other test")
        })
    })

    describe("Five Validators", () => {
        it("should apply five validators to a value sequentially and throw the first error encountered", async () => {
            let testVariable: string | undefined = "GB"

            // Type test
            let testValidator = combineValidators(
                isString,
                isISOAlpha2CountryCode,
                (i) => i,
                (i): "test" => {
                    throw new ValidationError(
                        "TEST_CONSTRAINT",
                        "This is a test"
                    )
                },
                (i) => i
            )

            try {
                // This useless variable is defined only to ensure type consistency
                let testOutput: "test" = await testValidator(testVariable)
                expect(false).to.equal(true)
            } catch (e) {
                expect(e instanceof ValidationError).to.equal(true)
                expect(e.message === "Value was undefined")
            }
        })

        it("should correctly apply the validations in the sequence provided", async () => {
            let testVariable: string | undefined = "GB"

            // Type test
            let testValidator = combineValidators(
                isString,
                isISOAlpha2CountryCode,
                (i): "test" => "test",
                (i): "other test" => "other test",
                (i): "final test" => "final test"
            )

            let testOutput: string = await testValidator(testVariable)
            expect(testOutput).to.equal("final test")
        })
    })
})
