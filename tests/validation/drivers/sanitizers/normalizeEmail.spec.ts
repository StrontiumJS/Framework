import { expect } from "chai"
import { ValidationError, normalizeEmail } from "../../../../src"

describe("normalizeEmail", () => {
    it("should return undefined if input is undefined", () => {
        expect(normalizeEmail({})(undefined)).to.equal(undefined)
    })

    it("should return the input email address if it is valid", () => {
        expect(normalizeEmail({})("jamie@iscool.com")).to.equal(
            "jamie@iscool.com"
        )
        expect(normalizeEmail({})("jamie+123@iscool.com")).to.equal(
            "jamie+123@iscool.com"
        )
    })

    it("should return a validation error if input is not a valid email", () => {
        expect(() => console.log(normalizeEmail({})("abc.com"))).to.throw(
            ValidationError
        )
        expect(() => normalizeEmail({})("@abc.com")).to.throw(ValidationError)
        expect(() => normalizeEmail({})("jamie@abc")).to.throw(ValidationError)
        expect(() => normalizeEmail({})({})).to.throw(ValidationError)
        expect(() => normalizeEmail({})(1)).to.throw(ValidationError)
        expect(() => normalizeEmail({})(0)).to.throw(ValidationError)
        expect(() => normalizeEmail({})(true)).to.throw(ValidationError)
        expect(() => normalizeEmail({})(false)).to.throw(ValidationError)
        expect(() => normalizeEmail({})(null)).to.throw(ValidationError)
    })
})
