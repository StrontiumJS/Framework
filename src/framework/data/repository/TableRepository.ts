import { Filter } from "../Filter"
import { Query } from "../Query"
import { Queryable } from "../Queryable"
import { Repository } from "./Repository"
import { isUndefined, omitBy } from "lodash"

/**
 * A TableRepository represents a one to one mapping with an underlying SQL table.
 *
 * It is designed to provide an 80% solution for common SQL workloads with the other 20% being taken up by custom
 * Repository classes or direct queries.
 */
export abstract class TableRepository<T extends any> extends Repository<T> {
    private primary_key_field: keyof T
    private datastore: Queryable
    private table_name: string
    private query_fields: Array<keyof T>

    constructor(
        store: Queryable,
        table_name: string,
        query_fields: Array<keyof T>,
        primary_key_field: keyof T
    ) {
        super()

        this.primary_key_field = primary_key_field
        this.datastore = store
        this.table_name = table_name
        this.query_fields = query_fields
    }

    async create(payload: Partial<T>): Promise<T> {
        // Generate an ID for the new record
        let id = await this.generateID()
        payload[this.primary_key_field] = payload[this.primary_key_field] || id

        // Filter the payload for any undefined keys
        let filtered_payload = omitBy(payload, isUndefined) as T

        let insert_query = `
            INSERT INTO 
                ??
            SET
                ?
        `

        // This can throw a SQL error which will be returned directly to the caller rather than handled here.
        let result: any = await this.datastore.query(insert_query, [
            this.table_name,
            filtered_payload,
        ])

        let inserted_id = result.insertId

        filtered_payload[this.primary_key_field] = inserted_id || id

        return filtered_payload
    }

    async read(
        filter: Filter<T>,
        pagination: {
            order?: [keyof T, "DESC" | "ASC"]
            limit?: number
            offset?: number
        } = {}
    ): Promise<Array<T>> {
        let [filter_query, filter_parameters] = Query.buildToMySQL(filter)
        let parameters = [this.table_name, ...filter_parameters]

        let lookup_query = `
            SELECT
                ${this.query_fields.join(", ")}
            FROM
                ??
            ${filter_query !== "" ? "WHERE" : ""}
                ${filter_query}
        `

        if (pagination.order) {
            lookup_query = `${lookup_query}
            ORDER BY ?? ${pagination.order[1]}`

            parameters.push(pagination.order[0])
        }

        if (pagination.limit) {
            lookup_query = `${lookup_query}
            LIMIT ?`

            parameters.push(pagination.limit)
        }

        if (pagination.offset) {
            lookup_query = `${lookup_query}
            OFFSET ?`

            parameters.push(pagination.offset)
        }

        let results = await this.datastore.query(lookup_query, parameters)

        return results
    }

    async update(payload: Partial<T>, filter: Filter<T>): Promise<void> {
        // Strip the object of the undefined parameters
        let filtered_payload = omitBy(payload, isUndefined) as T

        let [filter_query, filter_parameters] = Query.buildToMySQL(filter)

        let parameters = [
            this.table_name,
            filtered_payload,
            ...filter_parameters,
        ]

        let lookup_query = `
            UPDATE
                ??
            SET
                ?
            ${filter_query !== "" ? "WHERE" : ""}
                ${filter_query}
        `

        await this.datastore.query(lookup_query, parameters)
    }

    async delete(filter: Filter<T>): Promise<void> {
        let [filter_query, filter_parameters] = Query.buildToMySQL(filter)
        let parameters = [this.table_name, ...filter_parameters]

        let lookup_query = `
            DELETE FROM
                ??
            ${filter_query !== "" ? "WHERE" : ""}
                ${filter_query}
        `

        await this.datastore.query(lookup_query, parameters)
    }

    async generateID(): Promise<any> {
        return undefined
    }
}
