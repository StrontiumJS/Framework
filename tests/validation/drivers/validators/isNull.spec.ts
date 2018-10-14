import { expect } from "chai"
import { ValidationError, isNull } from "../../../../src"

describe("isNull", () => {
    it("should return undefined if input is undefined", () => {
        expect(isNull(undefined)).to.equal(undefined)
    })

    it("should return null if the input is null", () => {
        expect(isNull(null)).to.equal(null)
    })

    it("should return a validation error if input is not null", () => {
        expect(() => isNull({})).to.throw(ValidationError)
        expect(() => isNull("1")).to.throw(ValidationError)
        expect(() => isNull("0")).to.throw(ValidationError)
        expect(() => isNull("das")).to.throw(ValidationError)
        expect(() => isNull("true")).to.throw(ValidationError)
        expect(() => isNull("false")).to.throw(ValidationError)
        expect(() => isNull([])).to.throw(ValidationError)
    })
})
