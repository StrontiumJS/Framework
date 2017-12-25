import { SQLTransaction } from "../SQLTransaction"
import { PoolConnection } from "mysql"
import { v4 as generateUUID } from "uuid"

export class MySQLTransaction extends SQLTransaction {
    private connection: PoolConnection
    private rollback_point?: string

    constructor(connection: PoolConnection, rollback_point?: string) {
        super()

        this.connection = connection
        this.rollback_point = rollback_point
    }

    public async createTransaction(): Promise<MySQLTransaction> {
        return new Promise((resolve, reject) => {
            // Strip a UUID down to just letters as this appears to work for MySQL whereas numbers cause issues.
            // There is likely a far better replacement for this generation sequence using random bytes.
            let new_rollback_point = generateUUID().replace(/-/g, "").replace(/[0-9]/g, "")

            this.connection.query(
                `SAVEPOINT ${new_rollback_point}`,
                [],
                (err) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(
                        new MySQLTransaction(
                            this.connection,
                            new_rollback_point
                        )
                    )
                }
            )
        }) as Promise<MySQLTransaction>
    }

    public async commit(): Promise<void> {
        if (this.rollback_point === undefined) {
            return new Promise((resolve, reject) => {
                this.connection.query(`COMMIT`, (err) => {
                    if (err) {
                        return reject(err)
                    }

                    this.connection.release()
                    return resolve()
                })
            }) as Promise<void>
        } else {
            return new Promise((resolve, reject) => {
                this.connection.query(
                    `RELEASE SAVEPOINT ${this.rollback_point}`,
                    [],
                    (err) => {
                        if (err) {
                            return reject(err)
                        }

                        return resolve()
                    }
                )
            }) as Promise<void>
        }
    }

    public async rollback(): Promise<void> {
        if (this.rollback_point === undefined) {
            return new Promise((resolve, reject) => {
                this.connection.query(`ROLLBACK`, (err) => {
                    if (err) {
                        return reject(err)
                    }

                    this.connection.release()
                    return resolve()
                })
            }) as Promise<void>
        } else {
            return new Promise((resolve, reject) => {
                this.connection.query(
                    `ROLLBACK TO SAVEPOINT ${this.rollback_point}`,
                    [],
                    (err) => {
                        if (err) {
                            return reject(err)
                        }

                        return resolve()
                    }
                )
            }) as Promise<void>
        }
    }

    public async query(
        query: string,
        parameters: Array<any>
    ): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                query,
                parameters,
                (err, response: Array<any>) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(response)
                }
            )
        }) as Promise<Array<any>>
    }
}
