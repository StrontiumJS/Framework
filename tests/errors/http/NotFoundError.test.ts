import { HTTPError } from "../../../src/framework/errors/http/HTTPError"
import { NotFoundError } from "../../../src/framework/errors/http/NotFoundError"
import { StrontiumError } from "../../../src/framework/errors/StrontiumError"
import { expect } from "chai"

suite("Not Found Error", () => {
    test("The error identifies correctly as an instanceof Error, Strontium Error and HTTP Error", () => {
        let e = new NotFoundError()

        expect(e instanceof Error).to.equal(true)
        expect(e instanceof StrontiumError).to.equal(true)
        expect(e instanceof HTTPError).to.equal(true)
    })

    test("The status code method should return 404", () => {
        let e = new NotFoundError()
        expect(e.statusCode()).to.equal(404)
    })

    test("The body should contain the message", () => {
        let e = new NotFoundError("The Content no longer exists.")

        expect(e.render().message).to.equal("The Content no longer exists.")
    })
})
