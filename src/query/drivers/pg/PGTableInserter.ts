import { compilePgFilter } from "./PGFilterCompiler"
import { PGStore } from "../../../datastore/drivers/pg/PGStore"
import { Query } from "../../abstract/Query"
import { inject, injectable } from "inversify"

import { Filter } from "../.."

@injectable()
export class PGTableInserter<T extends Object> extends Query<void> {
    constructor(@inject(PGStore) private store: PGStore) {
        super()
    }

    public async execute<T>(
        tableName: string,
        filter: Filter<T>,
        payload: Partial<T>,
        returning?: string
    ): Promise<void> {
        let [filterQuery, filterParameters] = compilePgFilter(filter)

        let query = `
          INSERT INTO
            ${tableName}
          VALUES
            ${payload}
          WHERE
            ${filterQuery}
          ${returning === undefined ? "" : "RETURNING ??"}
        `

        let parameters = [payload, ...filterParameters]

        if (returning !== undefined) {
            parameters.push(returning)
        }

        await this.store.query(query, parameters)
    }
}
