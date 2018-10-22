import { pgQueryPostProcessor } from "../../../query/drivers/pg/PGQueryPostProcessor"
import { SQLStore } from "../../abstract/SQLStore"
import { Logger } from "../../../logging"
import { PoolClient } from "pg"
import { v4 } from "uuid"

export class PGTransaction implements SQLStore {
    private transactionId: string = v4()

    constructor(private connection: PoolClient, private logger?: Logger) {
        if (this.logger) {
            this.logger.debug("Transaction Opened", {
                transactionId: this.transactionId,
            })
        }
    }

    public async query<R>(
        queryString: string,
        parameters: Array<any>
    ): Promise<Array<R>> {
        let [processedQueryString, processedParameters] = pgQueryPostProcessor(
            queryString,
            parameters
        )

        let queryResult = await this.connection.query(
            processedQueryString,
            processedParameters
        )

        return queryResult.rows
    }

    public async commit(): Promise<void> {
        await this.connection.query("COMMIT")
        await this.finalizeTransaction()
    }

    public async rollback(): Promise<void> {
        await this.connection.query("ROLLBACK")
        await this.finalizeTransaction()
    }

    public async finalizeTransaction(): Promise<void> {
        if (this.logger) {
            this.logger.debug(`Transaction Closed`, {
                transactionId: this.transactionId,
            })
        }
        this.connection.release()
    }
}
