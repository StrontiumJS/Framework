import { expectToThrowCustomClass } from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import { ValidationError, isNull } from "../../../../src"

describe("isNull", () => {
    it("should return null if the input is null", () => {
        expect(isNull(null)).to.equal(null)
    })

    it("should return a validation error if input is not null", () => {
        expectToThrowCustomClass(() => isNull({}), ValidationError)
        expectToThrowCustomClass(() => isNull("1"), ValidationError)
        expectToThrowCustomClass(() => isNull("0"), ValidationError)
        expectToThrowCustomClass(() => isNull("das"), ValidationError)
        expectToThrowCustomClass(() => isNull("true"), ValidationError)
        expectToThrowCustomClass(() => isNull("false"), ValidationError)
        expectToThrowCustomClass(() => isNull([]), ValidationError)
    })
})
