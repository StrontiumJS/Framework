import { expect } from "chai"
import { isISODate, ValidationError } from "../../../../src";

describe("isISODate", () => {
    it("should return undefined if input is undefined", () => {
        expect(isISODate(undefined)).to.equal(undefined)
    })

    it("should return the a Date object if input is valid ISO code", () => {
        expect(isISODate('2018-10-07')!.getTime()).to.equal(1538870400000)
        expect(isISODate('2016-01-12')!.getTime()).to.equal(1452556800000)
        expect(isISODate('2018-10-07T19:21:40+00:00')!.getTime()).to.equal(1538940100000)
    })

    it("should return a validation error if input is not boolean", () => {
        expect(() => isISODate('12-01-2016')).to.throw(ValidationError)
        expect(() => isISODate('12/01/2016')).to.throw(ValidationError)
        expect(() => isISODate('2016/01/12')).to.throw(ValidationError)
        expect(() => isISODate('USA')).to.throw(ValidationError)
        expect(() => isISODate({})).to.throw(ValidationError)
        expect(() => isISODate(1)).to.throw(ValidationError)
        expect(() => isISODate(0)).to.throw(ValidationError)
        expect(() => isISODate('das')).to.throw(ValidationError)
        expect(() => isISODate('true')).to.throw(ValidationError)
        expect(() => isISODate('false')).to.throw(ValidationError)
        expect(() => isISODate([])).to.throw(ValidationError)
    })
})
