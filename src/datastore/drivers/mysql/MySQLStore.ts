import { MySQLTransaction } from "./MySQLTransaction"
import { SQLStore } from "../../abstract/SQLStore"
import { Container } from "inversify"
import { Logger } from "../../../logging"
import { Pool, PoolConfig, createPool } from "mysql"
import { Process } from "../../../runtime"
import { promisify } from "util"

export class MySQLStore implements Process, SQLStore {
    public healthyState: boolean = false
    private connection?: Pool
    private logger?: Logger

    constructor(private connectionOptions: PoolConfig) {}

    public isHealthy(): boolean {
        return this.healthyState
    }

    public async query<R>(
        queryString: string,
        parameters: Array<any>
    ): Promise<Array<R>> {
        if (this.connection) {
            try {
                // @ts-ignore
                let queryResult = await promisify(
                    this.connection.query.bind(this.connection)
                )(queryString, parameters)
                return queryResult.results
            } catch (e) {
                if (e.fatal) {
                    if (this.logger) {
                        this.logger.error(
                            "MySQL Store encountered a fatal error",
                            e
                        )
                    }

                    this.healthyState = false
                }

                throw e
            }
        } else {
            throw new Error(
                "The MySQLStore is not currently open and cannot be used. Check that the store has had .startup() called and that the Promise has successfully returned."
            )
        }
    }

    public async createTransaction(): Promise<MySQLTransaction> {
        if (this.connection === undefined) {
            throw new Error(
                "MySQL cannot open a transaction on a closed Pool. This usually happens from forgetting to call startup."
            )
        }

        let connection = await promisify(
            this.connection.getConnection.bind(this.connection)
        )()
        await promisify(connection.beginTransaction.bind(this.connection))()

        return new MySQLTransaction(this, connection, this.logger)
    }

    public async startup(container: Container): Promise<void> {
        if (this.connection === undefined) {
            if (container.isBound(Logger)) {
                this.logger = container.get(Logger)
            }

            this.connection = createPool(this.connectionOptions)
            this.healthyState = true

            container.bind(MySQLStore).toConstantValue(this)
        } else {
            throw new Error(
                "A MySQL Pool already exists and cannot be reinstated without first being closed. This usually happens from calling startup on an existing Runtime."
            )
        }
    }

    public async shutdown(container: Container): Promise<void> {
        if (this.connection) {
            container.unbind(MySQLStore)

            await promisify(this.connection.end.bind(this.connection))()

            // Dereference the pool
            this.connection = undefined
            this.healthyState = false
        }
    }
}
