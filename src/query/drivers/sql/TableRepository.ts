import { pgQueryPostProcessor } from "../pg/PGQueryPostProcessor"
import { Repository } from "../../abstract/Repository"
import { MySQLStore, SQLStore } from "../../../datastore"
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
export abstract class TableRepository<T extends any> extends Repository<T> {
    constructor(
        private store: SQLStore,
        private tableName: string,
        private queryFields: Array<keyof T>,
        private primaryKeyField: keyof T
    ) {
        super()
    }

    async create(
        payload: Partial<T>,
        connection: SQLStore = this.store
    ): Promise<T> {
        // Generate an ID for the new record
        let id = await this.generateID()
        payload[this.primaryKeyField] = payload[this.primaryKeyField] || id

        // Filter the payload for any undefined keys
        let filteredPayload = (omitBy(payload, isUndefined) as unknown) as T

        if (connection instanceof MySQLStore) {
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

            let insertedId = result.insertId
            filteredPayload[this.primaryKeyField] = insertedId || id

            return filteredPayload
        } else {
            let query = `
                INSERT INTO
                    ${this.tableName} (${Object.keys(payload).map(() => "??")})
                VALUES
                    (${Object.keys(payload).map(() => "?")})
                RETURNING ??
            `

            let parameters: Array<any> = []

            Object.keys(payload).forEach((k: string) => {
                parameters.push(k)
            })

            Object.keys(payload).forEach((k: string) => {
                parameters.push(payload[k as keyof T])
            })

            parameters.push(this.primaryKeyField)

            let [processedQuery, processedParameters] = pgQueryPostProcessor(
                query,
                parameters
            )

            let results = await this.store.query<{ [key: string]: any }>(
                processedQuery,
                processedParameters
            )
            filteredPayload[this.primaryKeyField] =
                results[0][this.primaryKeyField as string] || id

            return filteredPayload
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
        let parameters = [...filterParameters]

        let lookupQuery = `	
            SELECT
                ${this.queryFields.join(", ")}	
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
            LIMIT ?`
            parameters.push(pagination.limit)
        }

        if (pagination.offset) {
            lookupQuery = `${lookupQuery}	
            OFFSET ?`
            parameters.push(pagination.offset)
        }

        let [processedQuery, processedParameters] = pgQueryPostProcessor(
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

        let parameters = [this.tableName, filteredPayload, ...filterParameters]
        let lookupQuery = `	
            UPDATE
                ??
            SET
                ?
            ${filterQuery !== "" ? "WHERE" : ""}	
                ${filterQuery}	
        `

        let [processedQuery, processedParameters] = pgQueryPostProcessor(
            lookupQuery,
            parameters
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

        let [processedQuery, processedParameters] = pgQueryPostProcessor(
            lookupQuery,
            parameters
        )
        await connection.query(processedQuery, processedParameters)
    }

    async generateID(): Promise<any> {
        return undefined
    }
}
