import { compilePgFilter } from "./PGFilterCompiler"
import { PGStore } from "../../../datastore/drivers/pg/PGStore"
import { Query } from "../../abstract/Query"
import { inject, injectable } from "inversify"

import { Filter } from "../.."

@injectable()
export class PGTableUpdater<T extends Object> extends Query<void> {
    constructor(
        @inject(PGStore) private store: PGStore
    ) {
        super()
    }

    public async execute<T>(
        tableName: string,
        filter: Filter<T>,
        delta: Partial<T>
    ): Promise<void> {
        let [filterQuery, filterParameters] = compilePgFilter(filter)

        let query = `
          UPDATE
            ${tableName}
          SET
            ?
          WHERE
            ${filterQuery}
        `

        let parameters = [delta, ...filterParameters]

        await this.store.query(query, parameters)
    }
}
