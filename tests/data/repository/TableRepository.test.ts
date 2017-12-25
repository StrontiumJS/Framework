import { MySQLDatastore } from "../../../src/framework/data/sql/drivers/MySQLDatastore"
import { TableRepository } from "../../../src/framework/data/repository/TableRepository"
import * as Chai from "chai"
import * as ChaiAsPromised from "chai-as-promised"

Chai.use(ChaiAsPromised)
const expect = Chai.expect

interface TestModel {
    id: string

    test_number: number

    test_string: string
}

class TestRepository extends TableRepository<TestModel> {}

suite("TableRepository", () => {
    let test_store = new MySQLDatastore(process.env
        .MYSQL_CONNECTION_STRING as string)

    let test_repository: TestRepository

    beforeEach(async () => {
        await test_store.open()

        await test_store.query(
            "CREATE TABLE `test_repository` ( id CHAR(36), test_number INTEGER, test_string VARCHAR(255) )",
            []
        )

        test_repository = new TestRepository(
            test_store,
            "test_repository",
            ["id", "test_number", "test_string"],
            "id"
        )
    })

    afterEach(async () => {
        await test_store.query("DROP TABLE `test_repository`", [])

        await test_store.close()
    })

    suite("Create", () => {
        test("The record should be created with the UUID provided by the ID generation function", async () => {
            test_repository.generateID = async () =>
                "01d114d9-e5da-4197-839d-047f278355a5"

            await test_repository.create({
                test_number: 123,
                test_string: "more testing",
            })

            let result = await test_repository.create({
                test_number: 123,
                test_string: "more testing",
            })

            expect(result.id).to.equal("01d114d9-e5da-4197-839d-047f278355a5")
            expect(result.test_number).to.equal(123)
            expect(result.test_string).to.equal("more testing")
        })

        test("The record should be created in the datastore", async () => {
            test_repository.generateID = async () =>
                "5ab39c8a-4a03-4b45-8694-a9ec06489ac3"

            await test_repository.create({
                test_number: 123,
                test_string: "more testing",
            })

            let results = await test_store.query(
                "SELECT * FROM `test_repository`",
                []
            )

            expect(results).to.deep.equal([
                {
                    id: "5ab39c8a-4a03-4b45-8694-a9ec06489ac3",
                    test_number: 123,
                    test_string: "more testing",
                },
            ])
        })
    })

    suite("Read", () => {
        test("The repository should be able to read all results when no filter is provided", async () => {
            test_repository.generateID = async () => "1"
            await test_repository.create({
                test_number: 1,
                test_string: "test",
            })

            test_repository.generateID = async () => "2"
            await test_repository.create({
                test_number: 4,
                test_string: "another test",
            })

            await test_repository.create({
                id: "3",
                test_number: 5,
                test_string: "a final test",
            })

            let results = await test_repository.read([])

            expect(results).to.deep.equal([
                {
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                },
                {
                    id: "2",
                    test_number: 4,
                    test_string: "another test",
                },
                {
                    id: "3",
                    test_number: 5,
                    test_string: "a final test",
                },
            ])
        })

        test("The repository should be able to filter results using the provided filter", async () => {
            await Promise.all([
                test_repository.create({
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                }),
                test_repository.create({
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                }),
                test_repository.create({
                    id: "3",
                    test_number: 1,
                    test_string: "test three",
                }),
                test_repository.create({
                    id: "4",
                    test_number: 2,
                    test_string: "test three",
                }),
            ])

            let results = await test_repository.read(
                [["test_number", "=", 1]],
                {
                    order: ["id", "ASC"],
                }
            )

            expect(results).to.deep.equal([
                {
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                },
                {
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                },
                {
                    id: "3",
                    test_number: 1,
                    test_string: "test three",
                },
            ])
        })

        test("The repository should be able to limit results based on pagination", async () => {
            await Promise.all([
                test_repository.create({
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                }),
                test_repository.create({
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                }),
                test_repository.create({
                    id: "3",
                    test_number: 1,
                    test_string: "test three",
                }),
                test_repository.create({
                    id: "4",
                    test_number: 2,
                    test_string: "test three",
                }),
            ])

            let results = await test_repository.read([], {
                limit: 2,
                order: ["id", "ASC"],
            })

            expect(results).to.deep.equal([
                {
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                },
                {
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                },
            ])
        })

        test("The repository should be able to offset the results based on the pagination settings", async () => {
            await Promise.all([
                test_repository.create({
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                }),
                test_repository.create({
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                }),
                test_repository.create({
                    id: "3",
                    test_number: 1,
                    test_string: "test three",
                }),
                test_repository.create({
                    id: "4",
                    test_number: 2,
                    test_string: "test three",
                }),
            ])

            let results = await test_repository.read([], {
                limit: 2,
                offset: 2,
                order: ["id", "ASC"],
            })

            expect(results).to.deep.equal([
                {
                    id: "3",
                    test_number: 1,
                    test_string: "test three",
                },
                {
                    id: "4",
                    test_number: 2,
                    test_string: "test three",
                },
            ])
        })
    })

    suite("Update", () => {
        test("The repository should update the records in the datastore", async () => {
            await Promise.all([
                test_repository.create({
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                }),
                test_repository.create({
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                }),
            ])

            await test_repository.update(
                {
                    test_string: "Winning!",
                },
                []
            )

            let results = await test_repository.read([], {
                order: ["id", "ASC"],
            })

            expect(results).to.deep.equal([
                {
                    id: "1",
                    test_number: 1,
                    test_string: "Winning!",
                },
                {
                    id: "2",
                    test_number: 1,
                    test_string: "Winning!",
                },
            ])
        })

        test("Should only update records affected by the filter", async () => {
            await Promise.all([
                test_repository.create({
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                }),
                test_repository.create({
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                }),
            ])

            await test_repository.update(
                {
                    test_string: "Winning!",
                },
                [["id", "=", "1"]]
            )

            let results = await test_repository.read([], {
                order: ["id", "ASC"],
            })

            expect(results).to.deep.equal([
                {
                    id: "1",
                    test_number: 1,
                    test_string: "Winning!",
                },
                {
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                },
            ])
        })
    })

    suite("Delete", () => {
        test("The repository should delete records in the datastore", async () => {
            await Promise.all([
                test_repository.create({
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                }),
                test_repository.create({
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                }),
            ])

            await test_repository.delete([])

            let results = await test_repository.read([], {
                order: ["id", "ASC"],
            })

            expect(results).to.deep.equal([])
        })

        test("The repository should only delete records that match the Filter", async () => {
            await Promise.all([
                test_repository.create({
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                }),
                test_repository.create({
                    id: "2",
                    test_number: 1,
                    test_string: "another test",
                }),
            ])

            await test_repository.delete([["id", "=", "2"]])

            let results = await test_repository.read([], {
                order: ["id", "ASC"],
            })

            expect(results).to.deep.equal([
                {
                    id: "1",
                    test_number: 1,
                    test_string: "test",
                },
            ])
        })
    })
})
