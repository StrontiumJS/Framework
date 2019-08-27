import { expect } from "chai"
import { PGStore } from "../../../src/datastore"
import { Container, inject, injectable } from "inversify"
import { TableRepository } from "../../../src/query"

interface TestModel {
    testColumn: string
}

@injectable()
class TestRepository extends TableRepository<TestModel, "testColumn"> {
    constructor(@inject(PGStore) store: PGStore) {
        super(store, "tableTest", ["testColumn"], "testColumn")
    }
}

describe("TableRepository", () => {
    const store = new PGStore({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT ? Number(process.env.PG_PORT) : undefined,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    })
    const container: Container = new Container()

    beforeEach(async () => {
        await store.startup(container)
        await store.query(
            `CREATE TABLE "tableTest" (
                "testColumn" VARCHAR
            )`,
            []
        )
    })

    afterEach(async () => {
        await store.query(`DROP TABLE "tableTest"`, [])

        await store.shutdown(container)
    })

    it("should read all table records", async () => {
        let tableRepository = new TestRepository(store)
        let values = await tableRepository.read({})

        expect(values.length).to.equal(0)
    })

    it("should insert a record and read it", async () => {
        let tableRepository = new TestRepository(store)
        await tableRepository.create({
            testColumn: "val",
        })

        let values = await tableRepository.read({
            testColumn: "val",
        })
        expect(values.length).to.equal(1)
    })

    it("should update a record", async () => {
        let tableRepository = new TestRepository(store)
        await tableRepository.create({
            testColumn: "val",
        })

        await tableRepository.update(
            {
                testColumn: "new-val",
            },
            {
                testColumn: "val",
            }
        )

        let values = await tableRepository.read({
            testColumn: "new-val",
        })
        expect(values.length).to.equal(1)
    })

    it("should delete a record", async () => {
        let tableRepository = new TestRepository(store)
        await tableRepository.create({
            testColumn: "val",
        })
        await tableRepository.create({
            testColumn: "other",
        })

        let createdValues = await tableRepository.read({
            testColumn: "val",
        })
        expect(createdValues.length).to.equal(1)

        await tableRepository.delete({
            testColumn: "val",
        })

        let deletedValues = await tableRepository.read({
            testColumn: "val",
        })
        let remainingValues = await tableRepository.read({
            testColumn: "other",
        })
        expect(deletedValues.length).to.equal(0)
        expect(remainingValues.length).to.equal(1)
    })
})
