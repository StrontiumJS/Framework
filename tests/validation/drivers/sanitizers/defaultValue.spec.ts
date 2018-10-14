import { expect } from "chai"
import { defaultValue } from "../../../../src"

describe("defaultValue", () => {
    it("should return the default value if input is undefined", () => {
        expect(defaultValue("default")(undefined)).to.equal("default")
        expect(defaultValue(null)(undefined)).to.equal(null)
        expect(defaultValue(undefined)(undefined)).to.equal(undefined)
    })

    it("should return the input value if input is isn't undefined", () => {
        expect(defaultValue("notthing")(true)).to.equal(true)
        expect(defaultValue("notthing")(false)).to.equal(false)
        expect(defaultValue("notthing")(null)).to.equal(null)
        expect(defaultValue("notthing")("abc")).to.equal("abc")
        expect(defaultValue("notthing")({})).to.deep.equal({})
    })
})
