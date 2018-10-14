import { expect } from "chai"
import { Process, Runtime } from "../../../src/runtime"
import { stub } from "sinon"

class TestProcess implements Process {
    public async startup() {
        return Promise.resolve()
    }
    public async shutdown() {
        return Promise.resolve()
    }
    public isHealthy() {
        return true
    }
}

describe("Runtime", () => {
    let testProcess1 = new TestProcess()
    let testProcess2 = new TestProcess()

    beforeEach(() => {
        testProcess1 = new TestProcess()
        testProcess2 = new TestProcess()
    })

    describe("startup", () => {
        it("Should call startup on each of the provided processes", async () => {
            let spy1 = stub(testProcess1, "startup")
            let spy2 = stub(testProcess2, "startup")

            let runtime = new Runtime([testProcess1, testProcess2])

            await runtime.startup()

            expect(spy1.called).to.equal(true)
            expect(spy2.called).to.equal(true)
        })
    })

    describe("shutdown", () => {
        it("Should call shutdown on each of the provided processes", async () => {
            let spy1 = stub(testProcess1, "shutdown")
            let spy2 = stub(testProcess2, "shutdown")

            let runtime = new Runtime([testProcess1, testProcess2])

            await runtime.shutdown()

            expect(spy1.called).to.equal(true)
            expect(spy2.called).to.equal(true)
        })
    })

    describe("isHealthy", () => {
        it("should return true if all loggers are healthy", () => {
            stub(testProcess1, "isHealthy").returns(true)
            stub(testProcess2, "isHealthy").returns(true)

            let runtime = new Runtime([testProcess1, testProcess2])

            expect(runtime.isHealthy()).to.equal(true)
        })

        it("should return false if any loggers are un-healthy", () => {
            stub(testProcess1, "isHealthy").returns(true)
            stub(testProcess2, "isHealthy").returns(false)

            let runtime = new Runtime([testProcess1, testProcess2])

            expect(runtime.isHealthy()).to.equal(false)
        })
    })
})
