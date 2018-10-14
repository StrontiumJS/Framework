import { expect } from "chai"
import { notMissing } from "../../src/utils/typeGuard"

describe("notMissing", () => {
    it("should return true for value that isn't null or undefined", () => {
        expect(notMissing({})).to.equal(true)
        expect(notMissing(1)).to.equal(true)
        expect(notMissing(0)).to.equal(true)
        expect(notMissing(false)).to.equal(true)
        expect(notMissing("abc")).to.equal(true)
        expect(notMissing([])).to.equal(true)
        expect(notMissing([1, null])).to.equal(true)
        expect(notMissing([undefined, null])).to.equal(true)
    })

    it("should return false for value that is null", () => {
        expect(notMissing(null)).to.equal(false)
    })

    it("should return false for value that is undefined", () => {
        expect(notMissing(undefined)).to.equal(false)
    })
})
