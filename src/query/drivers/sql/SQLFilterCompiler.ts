import { Filter, FilterCompiler } from "../.."

/**
 * The SQL query compiler takes a standard Strontium Query and returns a SQL
 * query with arguments. It uses a MySQL dialect which requires Post Processing to operate
 * in other databases.
 */
export const compileSQLFilter: FilterCompiler<[string, Array<any>]> = (
    filter: Filter<any>
): [string, Array<any>] => {
    let queries: Array<[string, Array<any>]> = []

    if (filter.$or) {
        let subqueries = filter.$or.map(compileSQLFilter)

        let orQuery = concatQueryStringsWithConjunction(subqueries, "OR")

        queries.push(orQuery)
    }

    if (filter.$and) {
        let subqueries = filter.$and.map(compileSQLFilter)

        let andQuery = concatQueryStringsWithConjunction(subqueries, "AND")

        queries.push(andQuery)
    }

    for (let field in filter) {
        if (field === "$or" || field === "$and") {
            continue
        }

        // Don't process prototype values - separated from the special
        // keywords for TypeScript's benefit
        if (!filter.hasOwnProperty(field)) {
            continue
        }

        let subquery = filter[field]

        if (subquery === undefined) {
            continue
        } else if (subquery === null) {
            queries.push(["?? IS NULL", [field]])
        } else if (subquery.$in !== undefined) {
            if (subquery.$in.length === 0) {
                // IN with an empty array typically causes an error - just make a tautological filter instead
                queries.push(["TRUE = FALSE", []])
            } else {
                queries.push([
                    `?? IN (${subquery.$in.map((p: any) => "?").join(", ")})`,
                    [field, ...subquery.$in],
                ])
            }
        } else if (subquery.$nin !== undefined) {
            if (subquery.$nin.length === 0) {
                queries.push(["TRUE = TRUE", []])
            } else {
                queries.push([
                    `?? NOT IN (${subquery.$nin
                        .map((p: any) => "?")
                        .join(", ")})`,
                    [field, ...subquery.$nin],
                ])
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
        } else if (subquery.$contains !== undefined) {
            queries.push(["?? LIKE ?", [field, `%${subquery.$contains}%`]])
        } else if (subquery.$arr_contains !== undefined) {
            // This implementation is currently unique to PostgreSQL - We should consider how to add similar functionality to MySQL
            queries.push(["?? @> ?", [field, subquery.$arr_contains]])
        } else if (subquery.$eq !== undefined) {
            queries.push(["?? = ?", [field, subquery.$eq]])
        } else {
            queries.push(["?? = ?", [field, subquery]])
        }
    }

    // Submit the final queries AND'd together
    return concatQueryStringsWithConjunction(queries, "AND")
}

export const concatQueryStringsWithConjunction = (
    queries: Array<[string, Array<any>]>,
    conjunction: "AND" | "OR"
): [string, Array<any>] => {
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
