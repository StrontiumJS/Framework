import { Filter } from "./Filter"

/**
 * The Query class represents an abstract filter of structured data.
 * It makes no assumption as to the underlying structure or outcome of the query and is used as an
 * interchange format.
 */
export class Query {
    constructor(filter: Filter) {}

    /**
     * Export a query to a SQL string representing the relevant WHERE statement to fulfill the
     * queries specifications.
     *
     * @param {Array<[string , string , any]>} filter
     * @returns {[string , [any]]}
     */
    public static parseToSQL(filter: Filter): [string, Array<any>] {
        let query: string = ""
        let parameters: Array<any> = []

        filter.forEach((input, i, { length }) => {
            let [field, operator, value] = input
            let mergeType = "AND"

            if (input.length === 4) {
                mergeType = input[3]
            }

            if (mergeType === "AND" && i !== 0) {
                query += ` ) ${mergeType} ( `
            } else if (i === 0) {
                query += "( "
            } else if (i !== 0) {
                query += ` ${mergeType} `
            }

            // Map the query to a SQL string
            let conditionQuery = `?? ${operator} ?`

            if (operator === "IN") {
                conditionQuery = `?? IN (?)`
            }

            if (operator === "=" && value === null) {
                conditionQuery = `?? IS NULL`
            } else if (operator === "!=" && value === null) {
                conditionQuery = `?? IS NOT NULL`
            }

            query += conditionQuery

            if (i === length - 1) {
                query += " )"
            }

            // Add the correctly ordered parameters to the SQL parameters
            if (value === null) {
                parameters.push(field)
            } else {
                parameters.push(field, value)
            }
        })

        return [query, parameters]
    }
}
