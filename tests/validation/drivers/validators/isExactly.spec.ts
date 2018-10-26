import { expectToThrowCustomClass } from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import { isExactly } from "../../../../src/validation/drivers/validators/isExactly"
import { ValidationError, isBoolean } from "../../../../src"

describe("isExactly", () => {
    it("should return the input if the input is included in the allowed set", () => {
        let testValidator = isExactly(["test", "other-test", "more-test"])

        expect(testValidator("other-test")).to.equal("other-test")
        expect(testValidator("test")).to.equal("test")
        expect(testValidator("more-test")).to.equal("more-test")
    })

    it("should return a validation error if input is not boolean", () => {
        let testValidator = isExactly(["test", "other-test", "more-test"])

        expectToThrowCustomClass(() => testValidator({}), ValidationError)
        expectToThrowCustomClass(() => testValidator(1), ValidationError)
        expectToThrowCustomClass(() => testValidator(0), ValidationError)
        expectToThrowCustomClass(() => testValidator("das"), ValidationError)
        expectToThrowCustomClass(() => testValidator("true"), ValidationError)
        expectToThrowCustomClass(() => testValidator(false), ValidationError)
        expectToThrowCustomClass(() => testValidator([]), ValidationError)
    })
})
