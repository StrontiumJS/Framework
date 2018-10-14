import { pgQueryPostProcessor } from "../../../../src/query/drivers/pg/PGQueryPostProcessor"
import { PGStore } from "../../../../src/datastore/drivers/pg/PGStore"
import { expect } from "chai"
import { Container } from "inversify"

describe("PGStore", () => {
    const testStore = new PGStore({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT ? Number(process.env.PG_PORT) : undefined,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    })
    const container: Container = new Container()

    beforeEach(async () => {
        await testStore.startup(container)
    })

    afterEach(async () => {
        await testStore.shutdown(container)
    })

    describe("startup", () => {
        it("should register the PG Driver implementation with the container", () => {
            let store = container.get(PGStore)

            expect(store).to.equal(testStore)
        })
    })

    describe("shutdown", () => {
        it("should unregister the PG Driver implementation with the container", async () => {
            await testStore.shutdown(container)
            expect(container.isBound(PGStore)).to.equal(false)
        })
    })

    describe("query", () => {
        it("should submit queries to the PG database and return their results as an array of rows", async () => {
            let testQueryResults = await testStore.query(
                "SELECT 15 AS test",
                []
            )

            expect(testQueryResults).to.deep.equal([{ test: 15 }])
        })
    })

    describe("Transaction Builder", () => {
        beforeEach(async () => {
            await testStore.query(
                `CREATE TABLE trxIntegrationTest (
                id SERIAL,
                testcolumn VARCHAR
            )`,
                []
            )
        })

        afterEach(async () => {
            await testStore.query(`DROP TABLE trxIntegrationTest`, [])
        })

        it("should create a SQL transaction", async () => {
            let trx = await testStore.createTransaction()

            let [finalQuery, finalParameters] = pgQueryPostProcessor(
                "INSERT INTO trxIntegrationTest (??) VALUES (?)",
                ["testcolumn", "Hello Integration Test!"]
            )

            await trx.query(finalQuery, finalParameters)

            let preCommitResults = await testStore.query(
                "SELECT * FROM trxIntegrationTest",
                []
            )

            expect(preCommitResults).to.deep.equal([])

            await trx.commit()

            let postCommitResults = await testStore.query<{
                id: number
                testcolumn: string
            }>("SELECT * FROM trxIntegrationTest", [])

            expect(postCommitResults.length).to.equal(1)
            expect(postCommitResults[0].testcolumn).to.equal(
                "Hello Integration Test!"
            )
        })
    })
})
