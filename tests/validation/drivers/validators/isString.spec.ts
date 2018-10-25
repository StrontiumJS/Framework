import { expectToThrowCustomClass } from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import { ValidationError, isString } from "../../../../src"

describe("isString", () => {
    it("should return the input string if input is string", () => {
        expect(isString("abc")).to.equal("abc")
        expect(isString("")).to.equal("")
        expect(isString("undefined")).to.equal("undefined")
    })

    it("should return a validation error if input is not a string", () => {
        expectToThrowCustomClass(() => isString({}), ValidationError)
        expectToThrowCustomClass(() => isString(1), ValidationError)
        expectToThrowCustomClass(() => isString(0), ValidationError)
        expectToThrowCustomClass(() => isString(true), ValidationError)
        expectToThrowCustomClass(() => isString(false), ValidationError)
        expectToThrowCustomClass(() => isString(null), ValidationError)
    })
})
