import { pgQueryPostProcessor } from "./PGQueryPostProcessor"
import { PGStore } from "../../../datastore/drivers/pg/PGStore"
import { Query } from "../../abstract/Query"
import { compileSQLFilter } from "../sql/SQLFilterCompiler"
import { inject, injectable } from "inversify"

import { Filter } from "../.."

@injectable()
export class PGTableReader<T extends Object> extends Query<Array<unknown>> {
    constructor(@inject(PGStore) private store: PGStore) {
        super()
    }

    public async execute(
        tableName: string,
        filter: Filter<T>,
        fieldList: Array<string> | null = null,
        limit: number | null = null,
        offset: number | null = null
    ): Promise<Array<Partial<T>>> {
        let [filterQuery, filterParameters] = compileSQLFilter(filter)

        let query = `
          SELECT
            ${fieldList === null ? "*" : fieldList.join(", ")}
          FROM
            ${tableName}
          ${filterQuery === "" ? "" : "WHERE"}
            ${filterQuery}
          ${limit === null ? "" : "LIMIT ?"}
          ${offset === null ? "" : "OFFSET ?"}
        `

        let parameters = [...filterParameters]

        if (limit !== null) {
            parameters.push(limit)
        }

        if (offset !== null) {
            parameters.push(offset)
        }

        let [finalQuery, finalParameters] = pgQueryPostProcessor(
            query,
            parameters
        )
        return await this.store.query(finalQuery, finalParameters)
    }
}
