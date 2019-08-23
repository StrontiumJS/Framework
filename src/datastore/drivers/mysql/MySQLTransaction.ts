import { MySQLStore } from "./MySQLStore"
import { SQLStore } from "../../abstract/SQLStore"
import { Logger } from "../../../logging"
import { PoolConnection } from "mysql"
import { promisify } from "util"
import { v4 } from "uuid"

export class MySQLTransaction implements SQLStore {
    private transactionId: string = v4()

    constructor(
        private store: MySQLStore,
        private connection: PoolConnection,
        private logger?: Logger
    ) {
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
        try {
            // @ts-ignore
            let queryResult = await promisify(
                this.connection.query.bind(this.connection)
            )(queryString, parameters)

            return queryResult
        } catch (e) {
            if (e.fatal) {
                if (this.logger) {
                    this.logger.error(
                        "MySQL Transaction encountered a fatal error",
                        e
                    )
                }

                this.store.healthyState = false
            }

            throw e
        }
    }

    public async commit(): Promise<void> {
        await promisify(this.connection.commit.bind(this.connection))()
        await this.finalizeTransaction()
    }

    public async rollback(): Promise<void> {
        await promisify(this.connection.rollback.bind(this.connection))()
        await this.finalizeTransaction()
    }

    public async finalizeTransaction(): Promise<void> {
        if (this.logger) {
            this.logger.debug(`Transaction Closed`, {
                transactionId: this.transactionId,
            })
        }

        await promisify(this.connection.release.bind(this.connection))()
    }
}
