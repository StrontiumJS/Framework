import { expect } from "chai"
import { ValidationError, isBoolean } from "../../../../src"

describe("isBoolean", () => {
    it("should return undefined if input is undefined", () => {
        expect(isBoolean(undefined)).to.equal(undefined)
    })

    it("should return the input boolean if input is boolean", () => {
        expect(isBoolean(true)).to.equal(true)
        expect(isBoolean(false)).to.equal(false)
    })

    it("should return a validation error if input is not boolean", () => {
        expect(() => isBoolean({})).to.throw(ValidationError)
        expect(() => isBoolean(1)).to.throw(ValidationError)
        expect(() => isBoolean(0)).to.throw(ValidationError)
        expect(() => isBoolean("das")).to.throw(ValidationError)
        expect(() => isBoolean("true")).to.throw(ValidationError)
        expect(() => isBoolean("false")).to.throw(ValidationError)
        expect(() => isBoolean([])).to.throw(ValidationError)
    })
})
