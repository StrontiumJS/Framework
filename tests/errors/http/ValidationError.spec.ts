import { expect } from "chai"
import { ValidationError } from "../../../src"

describe("ValidationError", () => {
    it("should create a ValidationError", () => {
        let constraintName = "THING"
        let systemMessage = "a specific message"
        let userMessage = "a nice message."
        let error = new ValidationError(
            constraintName,
            systemMessage,
            userMessage
        )

        expect(error).to.be.instanceof(ValidationError)
        expect(error.constraintName).to.equal(constraintName)
        expect(error.internalMessage).to.equal(systemMessage)
        expect(error.externalMessage).to.equal(userMessage)
        expect(error.message).to.equal(systemMessage)
    })

    it("should default the friendly message to the system message", () => {
        let systemMessage = "a specific message"
        let error = new ValidationError("THING", systemMessage)

        expect(error.externalMessage).to.equal(systemMessage)
    })
})
