import { expectToThrowCustomClass } from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import {
    ValidationError,
    isISOAlpha2CountryCode,
    isISODate,
} from "../../../../src"

describe("isISODate", () => {
    it("should return the a Date object if input is valid ISO code", () => {
        expect(isISODate("2018-10-07")!.getTime()).to.equal(1538870400000)
        expect(isISODate("2016-01-12")!.getTime()).to.equal(1452556800000)
        expect(isISODate("2018-10-07T19:21:40+00:00")!.getTime()).to.equal(
            1538940100000
        )
    })

    it("should return a validation error if input is not boolean", () => {
        expectToThrowCustomClass(() => isISODate("12-01-2016"), ValidationError)
        expectToThrowCustomClass(() => isISODate("12/01/2016"), ValidationError)
        expectToThrowCustomClass(() => isISODate("2016/01/12"), ValidationError)
        expectToThrowCustomClass(() => isISODate("USA"), ValidationError)
        expectToThrowCustomClass(() => isISODate({}), ValidationError)
        expectToThrowCustomClass(() => isISODate(1), ValidationError)
        expectToThrowCustomClass(() => isISODate(0), ValidationError)
        expectToThrowCustomClass(() => isISODate("das"), ValidationError)
        expectToThrowCustomClass(() => isISODate("true"), ValidationError)
        expectToThrowCustomClass(() => isISODate("false"), ValidationError)
        expectToThrowCustomClass(() => isISODate([]), ValidationError)
    })
})
