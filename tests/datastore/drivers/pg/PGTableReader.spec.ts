import { PGStore } from "../../../../src/datastore/drivers/pg/PGStore"
import { expect } from "chai"
import { Container } from "inversify"
import { PGTableInserter, PGTableReader } from "../../../../src/query"

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
            `CREATE TABLE tableReaderTest (
                id SERIAL,
                testcolumn VARCHAR,
                testnumber INTEGER
            )`,
            []
        )
        await testStore.query(
            `INSERT INTO tableReaderTest (testcolumn, testnumber) VALUES ($1, $2)`,
            ["test", 123]
        )
    })

    afterEach(async () => {
        await testStore.query(`DROP TABLE tableReaderTest`, [])
    })

    it("should read the correct values from the table", async () => {
        let reader = new PGTableReader<{
            id: number
            testcolumn: string
            testnumber: number
        }>(testStore)

        let data = await reader.execute("tableReaderTest", {})

        expect(data[0].testcolumn).to.equal("test")
        expect(data[0].testnumber).to.equal(123)
    })

    it("should read the correct fields from the table", async () => {
        let reader = new PGTableReader<{
            id: number
            testcolumn: string
            testnumber: number
        }>(testStore)

        let data = await reader.execute("tableReaderTest", {}, ["testcolumn"])

        expect(data[0].testcolumn).to.equal("test")
        expect(data[0].testnumber).to.equal(undefined)
    })

    it("should apply a limit if provided", async () => {
        let reader = new PGTableReader<{
            id: number
            testcolumn: string
            testnumber: number
        }>(testStore)

        let data = await reader.execute(
            "tableReaderTest",
            {},
            ["testcolumn"],
            1
        )

        expect(data[0].testcolumn).to.equal("test")
        expect(data[0].testnumber).to.equal(undefined)
    })

    it("should apply an offset if provided", async () => {
        let reader = new PGTableReader<{
            id: number
            testcolumn: string
            testnumber: number
        }>(testStore)

        let data = await reader.execute(
            "tableReaderTest",
            {},
            ["testcolumn"],
            1,
            1
        )

        expect(data.length).to.equal(0)
    })
})
