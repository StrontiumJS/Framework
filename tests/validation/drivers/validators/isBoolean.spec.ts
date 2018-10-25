import { expectToThrowCustomClass } from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import { ValidationError, isBoolean, normalizeEmail } from "../../../../src"

describe("isBoolean", () => {
    it("should return the input boolean if input is boolean", () => {
        expect(isBoolean(true)).to.equal(true)
        expect(isBoolean(false)).to.equal(false)
    })

    it("should return a validation error if input is not boolean", () => {
        expectToThrowCustomClass(() => isBoolean({}), ValidationError)
        expectToThrowCustomClass(() => isBoolean(1), ValidationError)
        expectToThrowCustomClass(() => isBoolean(0), ValidationError)
        expectToThrowCustomClass(() => isBoolean("das"), ValidationError)
        expectToThrowCustomClass(() => isBoolean("true"), ValidationError)
        expectToThrowCustomClass(() => isBoolean("false"), ValidationError)
        expectToThrowCustomClass(() => isBoolean([]), ValidationError)
    })
})
