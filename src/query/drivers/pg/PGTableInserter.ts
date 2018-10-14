import { pgQueryPostProcessor } from "./PGQueryPostProcessor"
import { PGStore } from "../../../datastore/drivers/pg/PGStore"
import { Query } from "../../abstract/Query"
import { inject, injectable } from "inversify"

@injectable()
export class PGTableInserter<T extends Object> extends Query<void> {
    constructor(@inject(PGStore) private store: PGStore) {
        super()
    }

    public async execute(
        tableName: string,
        payload: Partial<T>,
        returning?: string
    ): Promise<void> {
        let query = `
          INSERT INTO
            ${tableName} (${Object.keys(payload).map(() => "??")})
          VALUES
            (${Object.keys(payload).map(() => "?")})
          ${returning === undefined ? "" : "RETURNING ??"}
        `

        let parameters: Array<any> = []

        Object.keys(payload).forEach((k: string) => {
            parameters.push(k)
        })

        Object.keys(payload).forEach((k: string) => {
            parameters.push(payload[k as keyof T])
        })

        if (returning !== undefined) {
            parameters.push(returning)
        }

        let [finalQuery, finalParameters] = pgQueryPostProcessor(
            query,
            parameters
        )
        await this.store.query(finalQuery, finalParameters)
    }
}
