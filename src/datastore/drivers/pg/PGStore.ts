import { PGTransaction } from "./PGTransaction"
import { SQLStore } from "../../abstract/SQLStore"
import { Container } from "inversify"
import { Logger } from "../../../logging"
import { Pool, PoolConfig } from "pg"
import { Process } from "../../../runtime"

export class PGStore implements Process, SQLStore {
    private connection?: Pool
    private logger?: Logger
    private healthyState: boolean = false

    constructor(private connectionOptions: PoolConfig) {}

    public isHealthy(): boolean {
        return this.healthyState
    }

    public async query<R>(
        queryString: string,
        parameters: Array<any>
    ): Promise<Array<R>> {
        if (this.connection) {
            let queryResult = await this.connection.query(
                queryString,
                parameters
            )

            return queryResult.rows
        } else {
            throw new Error(
                "The PGStore is not currently open and cannot be used. Check that the store has had .startup() called and that the Promise has successfully returned."
            )
        }
    }

    public async createTransaction(): Promise<PGTransaction> {
        if (this.connection === undefined) {
            throw new Error(
                "PGStore cannot open a transaction on a closed Pool. This usually happens from forgetting to call startup."
            )
        }

        let connection = await this.connection.connect()
        await connection.query("BEGIN")

        return new PGTransaction(connection, this.logger)
    }

    public async startup(container: Container): Promise<void> {
        if (this.connection === undefined) {
            if (container.isBound(Logger)) {
                this.logger = container.get(Logger)
            }

            this.connection = new Pool(this.connectionOptions)
            this.healthyState = true

            // Handle errors and mark the connection as unhealthy
            this.connection.on("error", (err) => {
                if (this.logger) {
                    this.logger.error("PGStore encountered an error", err)
                }

                this.healthyState = false
            })

            container.bind(PGStore).toConstantValue(this)
        } else {
            throw new Error(
                "A PG Pool already exists and cannot be reinstated without first being closed. This usually happens from calling startup on an existing Runtime."
            )
        }
    }

    public async shutdown(container: Container): Promise<void> {
        if (this.connection) {
            container.unbind(PGStore)

            await this.connection.end()

            // Dereference the pool
            this.connection = undefined
            this.healthyState = false
        }
    }
}
