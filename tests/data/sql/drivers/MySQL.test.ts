import * as Chai from "chai"
import * as ChaiAsPromised from "chai-as-promised"

import { ConfigurationError } from "../../../../src/framework/errors/ConfigurationError"
import { ConnectionError } from "../../../../src/framework/errors/ConnectionError"
import { MySQLDatastore } from "../../../../src/framework/data/sql/drivers/MySQLDatastore"

Chai.use(ChaiAsPromised)
const expect = Chai.expect

suite("MySQL", () => {
    suite("Connection / Disconnection", () => {
        test("It should throw a ConnectionError if the connection fails", async () => {
            // Create a datastore with a non existent address
            let test_instance = new MySQLDatastore(
                "mysql://not:real@127.0.0.1/strontium?charset=utf8mb4"
            )

            expect(test_instance.open()).to.be.rejectedWith(ConnectionError)
        })

        test("It should throw a ConfigurationError if the arguments provided are undefined", async () => {
            // This check needs further improvement for sure.
            expect(
                () => new MySQLDatastore(process.env.NON_EXISTANT as string)
            ).to.throw(ConfigurationError, /undefined/)
        })

        test("It should return a live connection to MySQL if it succeeds", async () => {
            let datastore = new MySQLDatastore(process.env
                .MYSQL_CONNECTION_STRING as string)

            try {
                await datastore.open()

                let results = await datastore.query("SELECT 1", [])

                expect(results[0])
                    .property("1")
                    .to.equal(1)
            } finally {
                await datastore.close()
            }
        })

        test("Calling close on an open connection should not trigger an error", async () => {
            let datastore = new MySQLDatastore(process.env
                .MYSQL_CONNECTION_STRING as string)

            await datastore.close()
        })

        test("Calling open on an open connection should reopen the connection", async () => {
            let datastore = new MySQLDatastore(process.env
                .MYSQL_CONNECTION_STRING as string)

            try {
                await datastore.open()

                await datastore.open()
            } finally {
                await datastore.close()
            }
        })
    })

    suite("Transactions", () => {
        let test_store = new MySQLDatastore(process.env
            .MYSQL_CONNECTION_STRING as string)

        beforeEach(async () => {
            await test_store.open()

            await test_store.query(
                "CREATE TABLE `test_trx` ( id INTEGER, test_field VARCHAR(255) )",
                []
            )
        })

        afterEach(async () => {
            await test_store.query("DROP TABLE `test_trx`", [])

            await test_store.close()
        })

        test("Attempting to open a transaction on a closed connection should throw a ConnectionError", async () => {
            let datastore = new MySQLDatastore(process.env
                .MYSQL_CONNECTION_STRING as string)

            expect(datastore.createTransaction()).to.be.rejectedWith(
                ConnectionError
            )
        })

        test("Changes made in a transaction should be persisted upon a commit operation", async () => {
            let transaction = await test_store.createTransaction()

            await transaction.query("INSERT INTO `test_trx` SET ?", [
                {
                    id: 12,
                    test_field: "test",
                },
            ])

            let pre_commit_results = await test_store.query(
                "SELECT id, test_field FROM test_trx",
                []
            )
            expect(pre_commit_results).to.deep.equal([])

            await transaction.commit()

            let post_commit_results = await test_store.query(
                "SELECT id, test_field FROM test_trx",
                []
            )
            expect(post_commit_results).to.deep.equal([
                {
                    id: 12,
                    test_field: "test",
                },
            ])
        })

        test("Changes made in a transaction should be reversed if the transaction is rolled back", async () => {
            let transaction = await test_store.createTransaction()

            await transaction.query("INSERT INTO `test_trx` SET ?", [
                {
                    id: 12,
                    test_field: "test",
                },
            ])

            let pre_rollback_results = await test_store.query(
                "SELECT id, test_field FROM test_trx",
                []
            )
            expect(pre_rollback_results).to.deep.equal([])

            await transaction.rollback()

            let post_rollback_results = await test_store.query(
                "SELECT id, test_field FROM test_trx",
                []
            )
            expect(post_rollback_results).to.deep.equal([])
        })

        test("Changes made in a nested transaction should be present when commited", async () => {
            let transaction = await test_store.createTransaction()

            await transaction.query("INSERT INTO `test_trx` SET ?", [
                {
                    id: 12,
                    test_field: "test",
                },
            ])

            let pre_rollback_results = await test_store.query(
                "SELECT id, test_field FROM test_trx",
                []
            )
            expect(pre_rollback_results).to.deep.equal([])

            let nested_transaction = await transaction.createTransaction()
            nested_transaction.query("INSERT INTO `test_trx` SET ?", [
                {
                    id: 13,
                    test_field: "test another",
                },
            ])

            await nested_transaction.commit()

            await transaction.commit()

            let post_rollback_results = await test_store.query(
                "SELECT id, test_field FROM test_trx",
                []
            )
            expect(post_rollback_results).to.deep.equal([
                {
                    id: 12,
                    test_field: "test",
                },
                {
                    id: 13,
                    test_field: "test another",
                },
            ])
        })

        test("Changes made in a nested transaction should be rolled back but not affect the outer transaction", async () => {
            let transaction = await test_store.createTransaction()

            await transaction.query("INSERT INTO `test_trx` SET ?", [
                {
                    id: 12,
                    test_field: "test",
                },
            ])

            let nested_transaction = await transaction.createTransaction()
            nested_transaction.query("INSERT INTO `test_trx` SET ?", [
                {
                    id: 13,
                    test_field: "test another",
                },
            ])

            let pre_rollback_results = await transaction.query(
                "SELECT id, test_field FROM test_trx",
                []
            )
            expect(pre_rollback_results).to.deep.equal([
                {
                    id: 12,
                    test_field: "test",
                },
                {
                    id: 13,
                    test_field: "test another",
                },
            ])

            await nested_transaction.rollback()

            await transaction.commit()

            let post_rollback_results = await test_store.query(
                "SELECT id, test_field FROM test_trx",
                []
            )
            expect(post_rollback_results).to.deep.equal([
                {
                    id: 12,
                    test_field: "test",
                },
            ])
        })
    })

    suite("Query Interface", () => {
        test("Attempting to query a closed connection should throw a ConnectionError", async () => {
            let datastore = new MySQLDatastore(process.env
                .MYSQL_CONNECTION_STRING as string)

            expect(datastore.query("SELECT 1", [])).to.be.rejectedWith(
                ConnectionError
            )
        })

        test("Simple Query Test", async () => {
            let datastore = new MySQLDatastore(process.env
                .MYSQL_CONNECTION_STRING as string)

            await datastore.open()

            try {
                let result = await datastore.query("SELECT ?", [[1, 2, 3]])

                expect(result).to.deep.equal([
                    {
                        1: 1,
                        2: 2,
                        3: 3,
                    },
                ])
            } finally {
                await datastore.close()
            }
        })
    })
})
