import { expect } from "chai"
import { HTTPError } from "../../../../src/framework/errors/http/HTTPError"
import { InternalError } from "../../../../src/framework/errors/http/InternalError"
import { UnauthorizedError } from "../../../../src/framework/errors/http/UnauthorizedError"
import { StrontiumError } from "../../../../src/framework/errors/StrontiumError"

suite("Unauthorized Error", () => {
    test("The error identifies correctly as an instanceof Error, Strontium Error and HTTP Error", () => {
        let e = new UnauthorizedError("Access Denied")

        expect(e instanceof Error).to.equal(true)
        expect(e instanceof StrontiumError).to.equal(true)
        expect(e instanceof HTTPError).to.equal(true)
    })

    test("The status code method should return 401", () => {
        let e = new UnauthorizedError("Access Denied")
        expect(e.status_code()).to.equal(401)
    })

    test("The body should contain the message", () => {
        let e = new UnauthorizedError("TEST MESSAGE")

        expect(e.render().message).to.equal("TEST MESSAGE")
    })
})