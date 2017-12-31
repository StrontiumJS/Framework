import { ForbiddenError } from "../../../src/framework/errors/http/ForbiddenError"
import { HTTPError } from "../../../src/framework/errors/http/HTTPError"
import { StrontiumError } from "../../../src/framework/errors/StrontiumError"
import { expect } from "chai"

suite("Forbidden Error", () => {
    test("The error identifies correctly as an instanceof Error, Strontium Error and HTTP Error", () => {
        let e = new ForbiddenError()

        expect(e instanceof Error).to.equal(true)
        expect(e instanceof StrontiumError).to.equal(true)
        expect(e instanceof HTTPError).to.equal(true)
    })

    test("The status code method should return 403", () => {
        let e = new ForbiddenError()

        expect(e.statusCode()).to.equal(403)
    })

    test("The body should contain the message", () => {
        let e = new ForbiddenError("My Test Message")

        expect(e.render().message).to.equal("My Test Message")
    })
})
