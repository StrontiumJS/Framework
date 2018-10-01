import { QueryCompiler } from "../abstract/QueryCompiler"

import { Query } from ".."

/**
 * The PostgreSQL query compiler takes a standard Strontium Query and returns a SQL
 * query with arguments passed to the Postgres driver as an array of objects.
 */
export class PGQueryCompiler implements QueryCompiler<[string, Array<any>]> {
    public compile(query: Query<any>): [string, Array<any>] {
        let queryString = ""
        let queryParameters = []

        if (query.$or) {
            let subqueries = query.$or.map((q) => this.compile(q))

            let orQuery = subqueries.reduce(
                (
                    memo,
                    [subqueryString, subqueryArguments],
                    idx
                ) => {
                    if (idx !== 0) {
                        memo[0] += " OR ("
                    }

                    memo[0] += subqueryString
                    memo[0] += ")"

                    memo[1].push(...subqueryArguments)

                    return memo
                },
                ["", []]
            )
        }
    }
}
