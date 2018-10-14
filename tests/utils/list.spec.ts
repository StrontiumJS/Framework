import { expect } from "chai"
import { compact } from "../../src/utils/list"

describe("compact", () => {
    it("should remove null and undefined elements", () => {
        const input = [0, 1, false, null, "", "hello", undefined, true, {}]

        expect(compact(input)).to.deep.equal([
            0,
            1,
            false,
            "",
            "hello",
            true,
            {},
        ])
    })
})
