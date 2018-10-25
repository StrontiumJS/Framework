import { expect } from "chai"
import {
    either,
    isBoolean,
    isISOAlpha2CountryCode,
    isNumber,
} from "../../../../src"

describe("either", () => {
    it("should return the first validator that passes", async () => {
        let testVariable: number | boolean = false
        let testValidator = either(isNumber, isBoolean, isISOAlpha2CountryCode)

        let testOutput: number | boolean | string = await testValidator(
            testVariable
        )
        expect(testOutput).to.equal(false)

        testVariable = 26
        testOutput = await testValidator(testVariable)
        expect(testOutput).to.equal(26)
    })
})
