import { expectToThrowCustomClass } from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import {
    ValidationError,
    isBoolean,
    isISOAlpha2CountryCode,
} from "../../../../src"

describe("isISOAlpha2CountryCode", () => {
    it("should return the input ISO code if input is valid ISO code", () => {
        expect(isISOAlpha2CountryCode("GB")).to.equal("GB")
        expect(isISOAlpha2CountryCode("US")).to.equal("US")
        expect(isISOAlpha2CountryCode("CN")).to.equal("CN")
    })

    it("should return a validation error if input is not boolean", () => {
        expectToThrowCustomClass(
            () => isISOAlpha2CountryCode("UQ"),
            ValidationError
        )
        expectToThrowCustomClass(
            () => isISOAlpha2CountryCode("USA"),
            ValidationError
        )
        expectToThrowCustomClass(
            () => isISOAlpha2CountryCode({}),
            ValidationError
        )
        expectToThrowCustomClass(
            () => isISOAlpha2CountryCode(1),
            ValidationError
        )
        expectToThrowCustomClass(
            () => isISOAlpha2CountryCode(0),
            ValidationError
        )
        expectToThrowCustomClass(
            () => isISOAlpha2CountryCode("das"),
            ValidationError
        )
        expectToThrowCustomClass(
            () => isISOAlpha2CountryCode("true"),
            ValidationError
        )
        expectToThrowCustomClass(
            () => isISOAlpha2CountryCode("false"),
            ValidationError
        )
        expectToThrowCustomClass(
            () => isISOAlpha2CountryCode([]),
            ValidationError
        )
    })
})
