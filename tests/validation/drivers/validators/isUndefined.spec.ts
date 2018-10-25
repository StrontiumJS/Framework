import { expectToThrowCustomClass } from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import { ValidationError, isString, isUndefined } from "../../../../src"

describe("isString", () => {
    it("should return the input string if input is string", () => {
        expect(isUndefined(undefined)).to.equal(undefined)
    })

    it("should return a validation error if input is not a string", () => {
        expectToThrowCustomClass(() => isUndefined({}), ValidationError)
        expectToThrowCustomClass(() => isUndefined(1), ValidationError)
        expectToThrowCustomClass(() => isUndefined(0), ValidationError)
        expectToThrowCustomClass(() => isUndefined(true), ValidationError)
        expectToThrowCustomClass(() => isUndefined(false), ValidationError)
        expectToThrowCustomClass(() => isUndefined(null), ValidationError)
        expectToThrowCustomClass(() => isUndefined("Test"), ValidationError)
    })
})
