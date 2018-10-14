import { expect } from "chai"
import { combineValidators } from "../../../../src/validation/drivers/helpers/combineValidators"
import {
    ValidationError,
    isObject,
    isRequired,
    isString,
} from "../../../../src"

describe("isNull", () => {
    const objectFilter = isObject({
        test: isString,
        otherTest: combineValidators(isString, isRequired),
    })

    it("should return undefined if input is undefined", async () => {
        expect(
            await isObject({
                test: isString,
            })(undefined)
        ).to.equal(undefined)
    })

    it("should return the validated object if all keys pass validation", async () => {
        expect(
            await objectFilter({
                test: "TEST",
                otherTest: "MORE TESTING",
            })
        ).to.deep.equal({
            test: "TEST",
            otherTest: "MORE TESTING",
        })

        expect(
            await objectFilter({
                otherTest: "MORE TESTING",
            })
        ).to.deep.equal({
            otherTest: "MORE TESTING",
        })
    })

    it("should return a validation error if the input is not an object", async () => {
        try {
            await objectFilter("string")
            expect(false).to.equal(true)
        } catch (e) {
            expect(e).to.be.instanceOf(ValidationError)
            expect(e.constraintName).to.equal("IS_OBJECT")
        }
    })

    it("should return a validation error if any of the keys fail their own validations", async () => {
        try {
            await objectFilter({
                test: "My Test",
                otherTest: null,
            })
            expect(false).to.equal(true)
        } catch (e) {
            expect(e).to.be.instanceOf(ValidationError)
            expect(e.constraintName).to.equal("IS_STRING")
        }
    })
})
