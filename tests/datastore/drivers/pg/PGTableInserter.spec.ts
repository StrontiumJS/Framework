import { Container } from "inversify"
import { PGStore } from "../../../../src/datastore/drivers/pg/PGStore"
import { PGTableInserter } from "../../../../src/query"
import { expect } from "chai"

describe("PGTableInserter", () => {
    const testStore = new PGStore({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT ? Number(process.env.PG_PORT) : undefined,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    })
    const container: Container = new Container()

    before(async () => {
        await testStore.startup(container)
    })

    after(async () => {
        await testStore.shutdown(container)
    })

    beforeEach(async () => {
        await testStore.query(
            `CREATE TABLE tableInserterTest (
                id SERIAL,
                testcolumn VARCHAR,
                testnumber INTEGER
            )`,
            []
        )
    })

    afterEach(async () => {
        await testStore.query(`DROP TABLE tableInserterTest`, [])
    })

    it("it should insert a value into the correct SQL table", async () => {
        let inserter = new PGTableInserter<{
            id: number
            testcolumn: string
            testnumber: number
        }>(testStore)

        await inserter.execute(
            "tableInserterTest",
            {
                testcolumn: "test value",
                testnumber: 1720,
            },
            "id"
        )

        let data = await testStore.query<{
            id: number
            testcolumn: string
            testnumber: number
        }>(
            `
            SELECT * FROM tableInserterTest
        `,
            []
        )

        expect(data[0].testcolumn).to.equal("test value")
        expect(data[0].testnumber).to.equal(1720)
    })
})
