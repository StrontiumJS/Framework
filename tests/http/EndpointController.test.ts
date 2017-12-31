import { ValidationError } from "../../src/framework/errors/http/ValidationError"
import * as Chai from "chai"
import * as ChaiAsPromised from "chai-as-promised"

import { TestController } from "./TestController"

Chai.use(ChaiAsPromised)
const expect = Chai.expect

suite("HTTP Endpoint Controller", () => {
    suite("Validation", () => {
        test("Should throw a Validation error if the content is invalid", async () => {
            let test_controller = new TestController()

            test_controller.test = "Not Correct"

            try {
                await test_controller.validate()

                // Fail loudly
                expect(true).to.equal(false)
            } catch (e) {
                expect(e instanceof ValidationError).to.equal(true)
                expect(e.message).to.equal('"test" must be one of [My Test]')
            }
        })
    })
})
