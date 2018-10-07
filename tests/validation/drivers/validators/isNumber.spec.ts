import { expect } from "chai"
import { isNumber, ValidationError } from "../../../../src";

describe("isNumber", () => {
    it("should return undefined if input is undefined", () => {
        expect(isNumber(undefined)).to.equal(undefined)
    })

    it("should return the input number if input is number", () => {
        expect(isNumber(0)).to.equal(0)
        expect(isNumber(1)).to.equal(1)
        expect(isNumber(-999)).to.equal(-999)
        expect(isNumber(123456789)).to.equal(123456789)
    })

    it("should return a validation error if input is not a number", () => {
        expect(() => isNumber({})).to.throw(ValidationError)
        expect(() => isNumber('1')).to.throw(ValidationError)
        expect(() => isNumber('0')).to.throw(ValidationError)
        expect(() => isNumber('das')).to.throw(ValidationError)
        expect(() => isNumber('true')).to.throw(ValidationError)
        expect(() => isNumber('false')).to.throw(ValidationError)
        expect(() => isNumber([])).to.throw(ValidationError)
    })
})
