import { pgQueryPostProcessor } from "./PGQueryPostProcessor"
import { PGStore } from "../../../datastore/drivers/pg/PGStore"
import { Query } from "../../abstract/Query"
import { compileSQLFilter } from "../sql/SQLFilterCompiler"
import { inject, injectable } from "inversify"

import { Filter } from "../.."

@injectable()
export class PGTableUpdater<T extends Object> extends Query<void> {
    constructor(@inject(PGStore) private store: PGStore) {
        super()
    }

    public async execute(
        tableName: string,
        filter: Filter<T>,
        delta: Partial<T>
    ): Promise<void> {
        let [filterQuery, filterParameters] = compileSQLFilter(filter)

        let query = `
          UPDATE
            ${tableName}
          SET
            ?
          ${filterQuery === "" ? "" : "WHERE"}
            ${filterQuery}
        `

        let parameters = [delta, ...filterParameters]

        let [finalQuery, finalParameters] = pgQueryPostProcessor(
            query,
            parameters
        )
        await this.store.query(finalQuery, finalParameters)
    }
}
