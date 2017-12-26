import { HTTPError } from "../../../src/framework/errors/http/HTTPError"
import { InternalError } from "../../../src/framework/errors/http/InternalError"
import { StrontiumError } from "../../../src/framework/errors/StrontiumError"
import { expect } from "chai"

suite("Internal Error", () => {
    test("The error identifies correctly as an instanceof Error, Strontium Error and HTTP Error", () => {
        let e = new InternalError()

        expect(e instanceof Error).to.equal(true)
        expect(e instanceof StrontiumError).to.equal(true)
        expect(e instanceof HTTPError).to.equal(true)
    })

    test("The status code method should return 500", () => {
        let e = new InternalError()
        expect(e.statusCode()).to.equal(500)
        expect(e.render().message).to.equal("An internal server error occurred")
    })
})
