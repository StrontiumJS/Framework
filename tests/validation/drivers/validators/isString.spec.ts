import { expect } from "chai"
import { isString, ValidationError } from "../../../../src";

describe("isString", () => {
    it("should return undefined if input is undefined", () => {
        expect(isString(undefined)).to.equal(undefined)
    })

    it("should return the input string if input is string", () => {
        expect(isString('abc')).to.equal('abc')
        expect(isString('')).to.equal('')
        expect(isString('undefined')).to.equal('undefined')
    })

    it("should return a validation error if input is not a string", () => {
        expect(() => isString({})).to.throw(ValidationError)
        expect(() => isString(1)).to.throw(ValidationError)
        expect(() => isString(0)).to.throw(ValidationError)
        expect(() => isString(true)).to.throw(ValidationError)
        expect(() => isString(false)).to.throw(ValidationError)
        expect(() => isString(null)).to.throw(ValidationError)
    })
})
