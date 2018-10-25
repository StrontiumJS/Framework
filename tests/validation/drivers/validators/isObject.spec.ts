import { expect } from "chai"
import { combineValidators } from "../../../../src/validation/drivers/helpers/combineValidators"
import {
  ValidationError,
  isISOAlpha2CountryCode,
  isObject,
  isString, isUndefined
} from "../../../../src";
import { either } from "../../../../src/validation/drivers/helpers/either";

describe("isNull", () => {
    const objectFilter = isObject({
        test: either(isString, isUndefined),
        otherTest: combineValidators(isString, isISOAlpha2CountryCode),
    })

    it("should return the validated object if all keys pass validation", async () => {
        expect(
            await objectFilter({
                test: "TEST",
                otherTest: "GB",
            })
        ).to.deep.equal({
            test: "TEST",
            otherTest: "GB",
        })

        expect(
            await objectFilter({
                otherTest: "GB",
            })
        ).to.deep.equal({
            otherTest: "GB",
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

    it("should return a required validation error if a key is absent", async () => {
      try {
        await objectFilter({
          test: "Test Value"
        })
        expect(false).to.equal(true)
      } catch (e) {
        expect(e).to.be.instanceOf(ValidationError)
        expect(e.constraintName).to.equal("IS_STRING")
      }
    })
})
