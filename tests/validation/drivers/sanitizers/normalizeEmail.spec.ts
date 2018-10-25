import { expectToThrowCustomClass } from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import { ValidationError, isString, normalizeEmail } from "../../../../src"

describe("normalizeEmail", () => {
    it("should return the input email address if it is valid", () => {
        expect(normalizeEmail({})("jamie@iscool.com")).to.equal(
            "jamie@iscool.com"
        )
        expect(normalizeEmail({})("jamie+123@iscool.com")).to.equal(
            "jamie+123@iscool.com"
        )
    })

    it("should return a validation error if input is not a valid email", () => {
        expectToThrowCustomClass(
            () => normalizeEmail({})("abc.com"),
            ValidationError
        )
        expectToThrowCustomClass(
            () => normalizeEmail({})("@abc.com"),
            ValidationError
        )
        expectToThrowCustomClass(
            () => normalizeEmail({})("jamie@abc"),
            ValidationError
        )
        expectToThrowCustomClass(() => normalizeEmail({})({}), ValidationError)
        expectToThrowCustomClass(() => normalizeEmail({})(1), ValidationError)
        expectToThrowCustomClass(() => normalizeEmail({})(0), ValidationError)
        expectToThrowCustomClass(
            () => normalizeEmail({})(true),
            ValidationError
        )
        expectToThrowCustomClass(
            () => normalizeEmail({})(false),
            ValidationError
        )
        expectToThrowCustomClass(
            () => normalizeEmail({})(null),
            ValidationError
        )
    })
})
