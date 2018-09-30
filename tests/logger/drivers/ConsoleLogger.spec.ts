import { expect } from "chai"
import { SinonStub, stub } from "sinon"
import { ConsoleLogger, LogLevel } from "../../../src"

describe("ConsoleLogger", () => {
    let fakeLogger: Console
    let logStub: SinonStub
    let infoStub: SinonStub
    let warnStub: SinonStub
    let errorStub: SinonStub

    beforeEach(() => {
        fakeLogger = {
            log: () => {},
            info: () => {},
            warn: () => {},
            error: () => {},
        } as Console
        logStub = stub(fakeLogger, "log")
        infoStub = stub(fakeLogger, "info")
        warnStub = stub(fakeLogger, "warn")
        errorStub = stub(fakeLogger, "error")
    })

    describe("Basic logging functionality", () => {
        let logger: ConsoleLogger

        beforeEach(() => {
            logger = new ConsoleLogger(LogLevel.DEBUG, fakeLogger)
        })

        it("should log a debug message to console.log", () => {
            const testArgs = { hello: "world" }
            const testMessage = "test message"

            logger.debug(testArgs, testMessage)

            expect(logStub.called).to.equal(true)
            expect(logStub.args[0]).to.deep.equal([testMessage, testArgs])
        })

        it("should log a info message to console.info", () => {
            const testArgs = { hello: "world" }
            const testMessage = "test message"

            logger.info(testArgs, testMessage)

            expect(infoStub.called).to.equal(true)
            expect(infoStub.args[0]).to.deep.equal([testMessage, testArgs])
        })

        it("should log a warn message to console.warn", () => {
            const testArgs = { hello: "world" }
            const testMessage = "test message"

            logger.warn(testArgs, testMessage)

            expect(warnStub.called).to.equal(true)
            expect(warnStub.args[0]).to.deep.equal([testMessage, testArgs])
        })

        it("should log a error message to console.error", () => {
            const testArgs = { hello: "world" }
            const testMessage = "test message"

            logger.error(testArgs, testMessage)

            expect(errorStub.called).to.equal(true)
            expect(errorStub.args[0]).to.deep.equal([testMessage, testArgs])
        })

        it("should log a fatal message to console.error", () => {
            const testArgs = { hello: "world" }
            const testMessage = "test message"

            logger.fatal(testArgs, testMessage)

            expect(errorStub.called).to.equal(true)
            expect(errorStub.args[0]).to.deep.equal([testMessage, testArgs])
        })
    })

    describe("Level precedence checks", () => {
        it("should not log a message of lower precedence", () => {
            const logger = new ConsoleLogger(LogLevel.FATAL, fakeLogger)

            logger.debug({}, "blah")
            expect(logStub.called).to.equal(false)

            logger.info({}, "blah")
            expect(infoStub.called).to.equal(false)

            logger.warn({}, "blah")
            expect(warnStub.called).to.equal(false)

            logger.error({}, "blah")
            expect(errorStub.called).to.equal(false)
        })

        it("should log a message of equal precedence", () => {
            const logger = new ConsoleLogger(LogLevel.WARN, fakeLogger)

            logger.warn({}, "blah")
            expect(warnStub.called).to.equal(true)
        })

        it("should log a message of higher precedence", () => {
            const logger = new ConsoleLogger(LogLevel.WARN, fakeLogger)

            logger.error({}, "blah")
            expect(errorStub.called).to.equal(true)

            logger.fatal({}, "blah")
            expect(errorStub.called).to.equal(true)
        })
    })
})
