import { expect } from "chai"
import { stub } from "sinon"
import {
    AggregateLogger,
    LogLevel,
    Logger,
    Process,
} from "../../../src"
import { Container } from "inversify";

class TestLogger extends Logger {
    public log() {}
}

class TestProcessLogger extends Logger implements Process {
    public log() {}
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

describe("AggregateLogger", () => {
    let fakeLogger: Logger
    let fakeProcessLogger1: Logger & Process
    let fakeProcessLogger2: Logger & Process
    let aggregateLogger: AggregateLogger

    beforeEach(() => {
        fakeLogger = new TestLogger()
        fakeProcessLogger1 = new TestProcessLogger()
        fakeProcessLogger2 = new TestProcessLogger()

        aggregateLogger = new AggregateLogger([
            fakeLogger,
            fakeProcessLogger1,
            fakeProcessLogger2,
        ])
    })

    describe("isHealthy", () => {
        it("should return true if all loggers are healthy", () => {
            stub(fakeProcessLogger1, "isHealthy").returns(true)
            stub(fakeProcessLogger2, "isHealthy").returns(true)
            expect(aggregateLogger.isHealthy()).to.equal(true)
        })

        it("should return false if any loggers are un-healthy", () => {
            stub(fakeProcessLogger1, "isHealthy").returns(true)
            stub(fakeProcessLogger2, "isHealthy").returns(false)
            expect(aggregateLogger.isHealthy()).to.equal(false)
        })
    })

    describe("startup", () => {
        it("should call startup on each logger", async () => {
            let processLogger1Stub = stub(fakeProcessLogger1, "startup").returns(Promise.resolve())
            let processLogger2Stub = stub(fakeProcessLogger2, "startup").returns(Promise.resolve())

            await aggregateLogger.startup(new Container())

            expect(processLogger1Stub.called).to.equal(true)
            expect(processLogger2Stub.called).to.equal(true)
        })
    })

    describe("shutdown", () => {
        it("should call shutdown on each logger", async () => {
            let processLogger1Stub = stub(fakeProcessLogger1, "shutdown").returns(Promise.resolve())
            let processLogger2Stub = stub(fakeProcessLogger2, "shutdown").returns(Promise.resolve())

            let container = new Container()
            await aggregateLogger.startup(container)
            await aggregateLogger.shutdown(container)

            expect(processLogger1Stub.called).to.equal(true)
            expect(processLogger2Stub.called).to.equal(true)
        })
    })

    describe("log", () => {
        it("should call log on each logger", async () => {
            let loggerStub = stub(fakeLogger, "log")
            let processLogger1Stub = stub(fakeProcessLogger1, "log")
            let processLogger2Stub = stub(fakeProcessLogger2, "log")

            let message = 'hello world';
            let level = LogLevel.DEBUG;
            let metadata = { foo: true }
            aggregateLogger.log(message, level, metadata)

            expect(loggerStub.calledWith(message, level, metadata)).to.equal(true)
            expect(processLogger1Stub.calledWith(message, level, metadata)).to.equal(true)
            expect(processLogger2Stub.calledWith(message, level, metadata)).to.equal(true)
        })
    })
})
