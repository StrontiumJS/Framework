import * as Chai from "chai"
import * as ChaiAsPromised from "chai-as-promised"

import { ConnectionError } from "../../../../src/framework/errors/ConnectionError"
import { ConfigurationError } from "../../../../src/framework/errors/ConfigurationError"
import { MySQLDatastore } from "../../../../src/framework/data/sql/drivers/MySQLDatastore"

Chai.use(ChaiAsPromised)
const expect = Chai.expect

suite("MySQL", () => {
    suite("Connection / Disconnection", () => {
        test("It should throw a ConnectionError if the connection fails", async () => {
            // Create a datastore with a non existant address
            let test_instance = new MySQLDatastore(
                "mysql://not:real@127.0.0.1/strontium?charset=utf8mb4"
            )

            await expect(test_instance.open()).to.be.rejectedWith(
                ConnectionError
            )
        })

        test("It should throw a ConfigurationError if the arguments provided are undefined", async () => {
            // This check needs further improvement for sure.
            await expect(() => new MySQLDatastore()).to.throw(
                ConfigurationError,
                /undefined/
            )
        })

        test("It should return a live connection to MySQL if it succeeds", async () => {
            let datastore = new MySQLDatastore(
                process.env.MYSQL_CONNECTION_STRING
            )

            try {
                await datastore.open()

                let results = await datastore.query("SELECT 1", [])

                expect(results[0])
                    .property(1)
                    .to.equal(1)
            } finally {
                await datastore.close()
            }
        })
    })

    suite("Transactions", () => {})

    suite("Query Interface", () => {
        test("Attempting to query a closed connection should throw a ConnectionError", async () => {
            let datastore = new MySQLDatastore(
                process.env.MYSQL_CONNECTION_STRING
            )

            expect(datastore.query("SELECT 1", [])).to.be.rejectedWith(
                ConnectionError
            )
        })
    })
})
