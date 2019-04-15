import { expect } from "chai"
import { RedisStore } from "../../../../src/datastore"
import { Container } from "inversify"

describe("RedisStore", () => {
    let testStore = new RedisStore()
    let container: Container = new Container()
    let key = "test-key"
    let value = "test-value"

    beforeEach(async () => {
        await testStore.startup(container)
    })

    afterEach(async () => {
        await testStore.shutdown(container)
    })

    describe("startup", () => {
        it("should register the RedisStore implementation with the container", () => {
            let store = container.get(RedisStore)

            expect(store).to.equal(testStore)
            expect(testStore.isHealthy()).to.equal(true)
        })
    })

    describe("shutdown", () => {
        it("should unregister the RedisStore implementation with the container", async () => {
            await testStore.shutdown(container)

            expect(container.isBound(RedisStore)).to.equal(false)
            expect(testStore.isHealthy()).to.equal(false)
        })
    })

    describe("sendCommand", () => {
        it("should send commands to redis and get the results", async () => {
            let setResult = await testStore.sendCommand<string | null>("set", [
                key,
                value,
            ])

            expect(setResult).to.equal("OK")
        })

        it("should throw errors", async () => {
            let hasThrown = false
            try {
                await testStore.sendCommand<string | null>("wrong command", [
                    key,
                    value,
                ])

                expect(false).to.equal(true)
            } catch (e) {
                hasThrown = true
            }
            expect(hasThrown).to.equal(true)
        })
    })

    describe("eval", () => {
        it("should execute lua scripts and get the results", async () => {
            let luaScript1 = 'return redis.call("set", KEYS[1], ARGV[1])'
            let setResult1 = await testStore.eval<string>(luaScript1, [
                1,
                key,
                value,
            ])

            expect(setResult1).to.deep.equal("OK")

            let luaScript2 = "return {1,2,3.33,nil,4}"
            let setResult2 = await testStore.eval<number[]>(luaScript2, [0])

            expect(setResult2).to.deep.equal([1, 2, 3])
        })
    })
})
