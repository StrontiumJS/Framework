import { expect } from "chai"
import {
    ValidationError,
    combineValidators,
    isNumber,
    isRequired,
} from "../../../../src"

describe("combineValidators", () => {
    describe("Two Validators", () => {
        it("should apply two validators to a value sequentially and throw the first error encountered", async () => {
            let testVariable: number | undefined

            // Type test
            let testValidator = combineValidators(isNumber, isRequired)

            try {
                // This useless variable is defined only to ensure type consistency
                let testOutput: number = await testValidator(testVariable)
                expect(false).to.equal(true)
            } catch (e) {
                expect(e instanceof ValidationError).to.equal(true)
                expect(e.message === "Value was undefined")
            }
        })

        it("should correctly apply the validations in the sequence provided", async () => {
            let testVariable: number | undefined = 15

            // Type test
            let testValidator = combineValidators(isNumber, isRequired)

            let testOutput: number = await testValidator(testVariable)
            expect(testOutput).to.equal(15)
        })
    })

    describe("Three Validators", () => {
        it("should apply three validators to a value sequentially and throw the first error encountered", async () => {
            let testVariable: number | undefined

            // Type test
            let testValidator = combineValidators(
                isNumber,
                isRequired,
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
            let testVariable: number | undefined = 15

            // Type test
            let testValidator = combineValidators(
                isNumber,
                isRequired,
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
                isNumber,
                isRequired,
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
            let testVariable: number | undefined = 15

            // Type test
            let testValidator = combineValidators(
                isNumber,
                isRequired,
                (i): "test" => "test",
                (i): "other test" => "other test"
            )

            let testOutput: string = await testValidator(testVariable)
            expect(testOutput).to.equal("other test")
        })
    })

    describe("Five Validators", () => {
        it("should apply five validators to a value sequentially and throw the first error encountered", async () => {
            let testVariable: number | undefined

            // Type test
            let testValidator = combineValidators(
                isNumber,
                isRequired,
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
            let testVariable: number | undefined = 15

            // Type test
            let testValidator = combineValidators(
                isNumber,
                isRequired,
                (i): "test" => "test",
                (i): "other test" => "other test",
                (i): "final test" => "final test"
            )

            let testOutput: string = await testValidator(testVariable)
            expect(testOutput).to.equal("final test")
        })
    })
})
