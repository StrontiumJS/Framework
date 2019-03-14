import { pgQueryPostProcessor } from "../pg/PGQueryPostProcessor"
import { Repository } from "../../abstract/Repository"
import {
    MySQLStore,
    MySQLTransaction,
    PGStore,
    SQLStore,
} from "../../../datastore"
import { injectable } from "inversify"
import { isUndefined, omitBy } from "lodash"

import { Filter, compileSQLFilter } from "../.."

/**
 * A TableRepository represents a one to one mapping with an underlying SQL table.
 *
 * It is designed to provide an 80% solution for common SQL workloads with the other 20% being taken up by custom
 * Repository classes or direct queries.
 */
@injectable()
export abstract class TableRepository<
    T extends any,
    K extends keyof T
> extends Repository<T, K> {
    protected postProcessor: (
        query: string,
        parameters: Array<any>
    ) => [string, Array<any>] = (q, p) => [q, p]

    constructor(
        protected store: SQLStore,
        protected tableName: string,
        protected queryFields: Array<keyof T>,
        protected primaryKeyField: K
    ) {
        super()

        if (store instanceof PGStore) {
            this.postProcessor = pgQueryPostProcessor
            this.tableName = `"${this.tableName}"`
        }
    }

    async create(
        payload: Partial<T>,
        connection: SQLStore = this.store
    ): Promise<T[K]> {
        // Generate an ID for the new record
        let id = await this.generateID()
        payload[this.primaryKeyField] = payload[this.primaryKeyField] || id

        // Filter the payload for any undefined keys
        let filteredPayload = (omitBy(payload, isUndefined) as unknown) as T

        if (
            connection instanceof MySQLStore ||
            connection instanceof MySQLTransaction
        ) {
            let insertQuery = `
                INSERT INTO
                    ??
                SET
                    ?
            `

            // This can throw a SQL error which will be returned directly to the caller rather than handled here.
            let result: any = await connection.query(insertQuery, [
                this.tableName,
                filteredPayload,
            ])

            return result.insertId || id
        } else {
            let query = `
                INSERT INTO
                    ?? (${Object.keys(filteredPayload).map(() => "??")})
                VALUES
                    (${Object.keys(filteredPayload).map(() => "?")})
                RETURNING ??
            `

            let parameters: Array<any> = [this.tableName]

            Object.keys(filteredPayload).forEach((k: string) => {
                parameters.push(k)
            })

            Object.keys(filteredPayload).forEach((k: string) => {
                parameters.push(filteredPayload[k as keyof T])
            })

            parameters.push(this.primaryKeyField)

            let [processedQuery, processedParameters] = this.postProcessor(
                query,
                parameters
            )

            let results = await connection.query<{ [key: string]: any }>(
                processedQuery,
                processedParameters
            )

            return results[0][this.primaryKeyField as string] || id
        }
    }

    async read(
        filter: Filter<T>,
        pagination: {
            order?: [keyof T, "DESC" | "ASC"]
            limit?: number
            offset?: number
        } = {},
        connection: SQLStore = this.store
    ): Promise<Array<T>> {
        let [filterQuery, filterParameters] = compileSQLFilter(filter)
        let parameters = [this.tableName, ...filterParameters]

        let lookupQuery = `	
            SELECT
                ${this.queryFields.map((f) => `"${f}"`).join(", ")}	
            FROM
                ??
            ${filterQuery !== "" ? "WHERE" : ""}
                ${filterQuery}	
        `

        if (pagination.order) {
            lookupQuery = `${lookupQuery}	
            ORDER BY ?? ${pagination.order[1]}`
            parameters.push(pagination.order[0])
        }

        if (pagination.limit) {
            lookupQuery = `${lookupQuery}	
            LIMIT ${pagination.limit}`
        }

        if (pagination.offset) {
            lookupQuery = `${lookupQuery}	
            OFFSET ${pagination.offset}`
        }

        let [processedQuery, processedParameters] = this.postProcessor(
            lookupQuery,
            parameters
        )
        let results = await connection.query<T>(
            processedQuery,
            processedParameters
        )
        return results
    }

    async update(
        payload: Partial<T>,
        filter: Filter<T>,
        connection: SQLStore = this.store
    ): Promise<void> {
        // Strip the object of the undefined parameters
        let filteredPayload = (omitBy(payload, isUndefined) as unknown) as T
        let [filterQuery, filterParameters] = compileSQLFilter(filter)

        let lookupQuery = `	
            UPDATE
                ??
            SET
                ${Object.keys(filteredPayload).map(() => "?? = ?")}
            ${filterQuery !== "" ? "WHERE" : ""}	
                ${filterQuery}
        `

        let payloadParameters: Array<any> = []
        Object.keys(filteredPayload).forEach((k) => {
            payloadParameters.push(k)
            payloadParameters.push(filteredPayload[k])
        })

        let [processedQuery, processedParameters] = this.postProcessor(
            lookupQuery,
            [this.tableName, ...payloadParameters, ...filterParameters]
        )
        await connection.query(processedQuery, processedParameters)
    }

    async delete(
        filter: Filter<T>,
        connection: SQLStore = this.store
    ): Promise<void> {
        let [filterQuery, filterParameters] = compileSQLFilter(filter)
        let parameters = [this.tableName, ...filterParameters]

        let lookupQuery = `	
            DELETE FROM	
                ??
            ${filterQuery !== "" ? "WHERE" : ""}	
                ${filterQuery}	
        `

        let [processedQuery, processedParameters] = this.postProcessor(
            lookupQuery,
            parameters
        )
        await connection.query(processedQuery, processedParameters)
    }

    async generateID(): Promise<any> {
        return undefined
    }
}
