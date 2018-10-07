import { expect } from "chai"
import { isRequired, ValidationError } from "../../../../src";

describe("isRequired", () => {
    it("should return the input if input is not undefined", () => {
        expect(isRequired(0)).to.equal(0)
        expect(isRequired(1)).to.equal(1)
        expect(isRequired({})).to.deep.equal({})
        expect(isRequired([])).to.deep.equal([])
        expect(isRequired('abc')).to.equal('abc')
        expect(isRequired(false)).to.equal(false)
        expect(isRequired(null)).to.equal(null)
        expect(isRequired('undefined')).to.equal('undefined')
    })

    it("should return a validation error if input is undefined", () => {
        expect(() => isRequired(undefined)).to.throw(ValidationError)
    })
})
