import { ContentMoved } from "../../../src/framework/errors/http/ContentMoved"
import { HTTPError } from "../../../src/framework/errors/http/HTTPError"
import { StrontiumError } from "../../../src/framework/errors/StrontiumError"
import { expect } from "chai"

suite("Content Moved", () => {
    test("The error identifies correctly as an instanceof Error, Strontium Error and HTTP Error", () => {
        let e = new ContentMoved("https://new-destination.com")

        expect(e instanceof Error).to.equal(true)
        expect(e instanceof StrontiumError).to.equal(true)
        expect(e instanceof HTTPError).to.equal(true)
    })

    test("The status code method should return 301 when permanent is set", () => {
        let e = new ContentMoved("https://new-destination.com", true)

        expect(e.statusCode()).to.equal(301)
        expect(e.render()).to.deep.equal({})
    })

    test("The status code method should return 302 when permanent is set to false", () => {
        let e = new ContentMoved("https://new-destination.com", false)

        expect(e.statusCode()).to.equal(302)
        expect(e.headers()).to.deep.equal({
            Location: "https://new-destination.com"
        })
    })
})
