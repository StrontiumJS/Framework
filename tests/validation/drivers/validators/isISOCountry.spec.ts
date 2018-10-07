import { expect } from "chai"
import { ValidationError, isISOAlpha2CountryCode } from "../../../../src"

describe("isISOAlpha2CountryCode", () => {
    it("should return undefined if input is undefined", () => {
        expect(isISOAlpha2CountryCode(undefined)).to.equal(undefined)
    })

    it("should return the input ISO code if input is valid ISO code", () => {
        expect(isISOAlpha2CountryCode("GB")).to.equal("GB")
        expect(isISOAlpha2CountryCode("US")).to.equal("US")
        expect(isISOAlpha2CountryCode("CN")).to.equal("CN")
    })

    it("should return a validation error if input is not boolean", () => {
        expect(() => isISOAlpha2CountryCode("UQ")).to.throw(ValidationError)
        expect(() => isISOAlpha2CountryCode("USA")).to.throw(ValidationError)
        expect(() => isISOAlpha2CountryCode({})).to.throw(ValidationError)
        expect(() => isISOAlpha2CountryCode(1)).to.throw(ValidationError)
        expect(() => isISOAlpha2CountryCode(0)).to.throw(ValidationError)
        expect(() => isISOAlpha2CountryCode("das")).to.throw(ValidationError)
        expect(() => isISOAlpha2CountryCode("true")).to.throw(ValidationError)
        expect(() => isISOAlpha2CountryCode("false")).to.throw(ValidationError)
        expect(() => isISOAlpha2CountryCode([])).to.throw(ValidationError)
    })
})
