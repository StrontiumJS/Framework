import { ConfigurationError } from "../../../errors/ConfigurationError"
import { ConnectionError } from "../../../errors/ConnectionError"
import { MySQLTransaction } from "./MySQLTransaction"
import { SQLDatastore } from "../SQLDatastore"
import { equal as assert } from "assert"
import { Pool, PoolConfig, createPool } from "mysql"

/**
 * A MySQLStore is used to represent a queryable instance of MySQL.
 *
 * It implements SQLDatastore meaning that in addition to providing a mechanism for connecting to and disconnecting from the server
 * it also provides a query interface where queries can be provided to the store and allows for the creation of Transactions.
 *
 * This implementation internally uses a connection pool - which by default will use a maximum of 10 concurrent connections.
 * Newer versions of MySQL are routinely able to handle a much higher number of connections so depending on the performance
 * constraints and design intent of the system end users may wish to increase this by passing the relevant arguments to the constructor.
 *
 * The connection_options argument of the constructor is passed directly to MySQL JS - the appropriate documentation for the connection options
 * can be found at https://github.com/mysqljs/mysql#connection-options
 */
export class MySQLDatastore extends SQLDatastore {
    /**
     * The connection options used to open the underlying mysql connection
     */
    private connection_options: PoolConfig | string
    private underlying_connection_pool?: Pool

    constructor(connection_options: PoolConfig | string) {
        super()

        if (connection_options === undefined) {
            throw new ConfigurationError(`The connection options passed to MySQL Store were undefined. 
            If you are unsure how this error occurred check that the value passed into MySQL is defined in every case.
            It could be that an environmental variable is missing?`)
        }

        this.connection_options = connection_options
    }

    public async createTransaction(): Promise<MySQLTransaction> {
        return new Promise((resolve, reject) => {
            if (this.underlying_connection_pool === undefined) {
                return reject(
                    new ConnectionError(
                        "A Transaction cannot be instantiated on an uninitiated connection pool"
                    )
                )
            }

            return this.underlying_connection_pool.getConnection(
                (err, connection) => {
                    if (err) {
                        connection.release()
                        return reject(err)
                    }

                    connection.beginTransaction((err) => {
                        if (err) {
                            connection.release()
                            return reject(err)
                        }

                        connection.query("BEGIN TRANSACTION", (err) => {
                            if (err) {
                                connection.release()
                                return reject(err)
                            }

                            return resolve(new MySQLTransaction(connection))
                        })
                    })
                }
            )
        }) as Promise<MySQLTransaction>
    }

    public async open(): Promise<void> {
        if (this.underlying_connection_pool !== undefined) {
            await this.close()
        }

        this.underlying_connection_pool = createPool(this.connection_options)

        try {
            let test = await this.query("SELECT 1", [])

            assert(test[0][1], 1)
        } catch (e) {
            throw new ConnectionError(
                "Could not open connection to the provided Datastore"
            )
        }
    }

    public async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.underlying_connection_pool === undefined) {
                return resolve()
            }

            return this.underlying_connection_pool.end((err) => {
                if (err) {
                    return reject(err)
                }

                this.underlying_connection_pool = undefined
                return resolve()
            })
        }) as Promise<void>
    }

    public async query(
        query: string,
        parameters: Array<any>
    ): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            if (this.underlying_connection_pool === undefined) {
                return reject(
                    new ConnectionError(
                        "A query cannot be executed on an uninitiated connection pool."
                    )
                )
            }

            this.underlying_connection_pool.query(
                query,
                parameters,
                (err, response: Array<any>) => {
                    if (err) {
                        return reject(err)
                    }

                    resolve(response)
                }
            )
        }) as Promise<Array<any>>
    }
}
