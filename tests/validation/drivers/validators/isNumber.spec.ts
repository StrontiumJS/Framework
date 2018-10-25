import { expectToThrowCustomClass } from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import { ValidationError, isNumber } from "../../../../src"

describe("isNumber", () => {
    it("should return the input number if input is number", () => {
        expect(isNumber(0)).to.equal(0)
        expect(isNumber(1)).to.equal(1)
        expect(isNumber(-999)).to.equal(-999)
        expect(isNumber(123456789)).to.equal(123456789)
    })

    it("should return a validation error if input is not a number", () => {
        expectToThrowCustomClass(() => isNumber({}), ValidationError)
        expectToThrowCustomClass(() => isNumber("1"), ValidationError)
        expectToThrowCustomClass(() => isNumber("0"), ValidationError)
        expectToThrowCustomClass(() => isNumber("das"), ValidationError)
        expectToThrowCustomClass(() => isNumber("true"), ValidationError)
        expectToThrowCustomClass(() => isNumber("false"), ValidationError)
        expectToThrowCustomClass(() => isNumber([]), ValidationError)
    })
})
