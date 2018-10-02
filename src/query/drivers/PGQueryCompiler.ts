import { QueryCompiler } from "../abstract/QueryCompiler"

import { Query } from ".."

/**
 * The PostgreSQL query compiler takes a standard Strontium Query and returns a SQL
 * query with arguments passed to the Postgres driver as an array of objects.
 */
export class PGQueryCompiler implements QueryCompiler<[string, Array<any>]> {
    public compile(query: Query<any>): [string, Array<any>] {
        let queries: Array<[string, Array<any>]> = []

        if (query.$or) {
            let subqueries = query.$or.map((q) => this.compile(q))

            let orQuery = this.concatQueryStringsWithConjunction(
                subqueries,
                "OR"
            )

            queries.push(orQuery)
        }

        if (query.$and) {
            let subqueries = query.$and.map((q) => this.compile(q))

            let andQuery = this.concatQueryStringsWithConjunction(
                subqueries,
                "AND"
            )

            queries.push(andQuery)
        }

        for (let field in query) {
            if (field === "$or" || field === "$and") {
                continue
            }

            // Don't process prototype values - separated from the special
            // keywords for TypeScript's benefit
            if (!query.hasOwnProperty(field)) {
                continue
            }

            let subquery = query[field]

            if (subquery === null) {
                queries.push(["?? IS NULL", [field]])
            } else if (subquery.$in !== undefined) {
                if (subquery.$in.length === 0) {
                    // IN with an empty array typically causes an error - just make a tautological query instead
                    queries.push(["TRUE = FALSE", []])
                } else {
                    queries.push(["?? IN ?", [field, subquery.$in]])
                }
            } else if (subquery.$nin !== undefined) {
                if (subquery.$nin.length === 0) {
                    queries.push(["TRUE = TRUE", []])
                } else {
                    queries.push(["?? NOT IN ?", [field, subquery.$nin]])
                }
            } else if (subquery.$neq !== undefined) {
                if (subquery.$neq === null) {
                    queries.push(["?? IS NOT NULL", [field]])
                } else {
                    queries.push(["?? != ?", [field, subquery.$neq]])
                }
            } else if (subquery.$gt !== undefined) {
                queries.push(["?? > ?", [field, subquery.$gt]])
            } else if (subquery.$gte !== undefined) {
                queries.push(["?? >= ?", [field, subquery.$gte]])
            } else if (subquery.$lt !== undefined) {
                queries.push(["?? < ?", [field, subquery.$lt]])
            } else if (subquery.$lte !== undefined) {
                queries.push(["?? <= ?", [field, subquery.$lte]])
            } else {
                queries.push(["?? = ?", [field, subquery]])
            }
        }

        // Submit the final queries AND'd together
        return this.concatQueryStringsWithConjunction(queries, "AND")
    }

    private concatQueryStringsWithConjunction(
        queries: Array<[string, Array<any>]>,
        conjunction: "AND" | "OR"
    ): [string, Array<any>] {
        if (queries.length === 1) {
            return [queries[0][0], queries[0][1]]
        }

        return queries.reduce(
            (memo, [subqueryString, subqueryArguments], idx) => {
                if (idx !== 0) {
                    memo[0] += ` ${conjunction} `
                }

                memo[0] += "("
                memo[0] += subqueryString
                memo[0] += ")"

                memo[1].push(...subqueryArguments)

                return memo
            },
            ["", []]
        )
    }
}
