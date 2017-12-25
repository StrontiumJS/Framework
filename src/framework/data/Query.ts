import { BadQueryError } from "../errors/BadQueryError"
import { Filter } from "./Filter"

/**
 * The Query class represents an abstract filter of structured data.
 * It makes no assumption as to the underlying structure or outcome of the query and is used as an
 * interchange format.
 */
export abstract class Query {
    /**
     * Take a Filter and reduce it to a MySQL compatible WHERE statement.
     *
     * @param filter A filter to convert to a SQL WHERE or HAVING compatible statement
     */
    public static buildToMySQL(filter: Filter<any>): [string, Array<any>] {
        //  Reduce the Filter provided into a query string and parameters for the query
        let query: string = ""
        let parameters: Array<any> = []

        // Set the merge type to AND by default
        let last_merge_type = "AND"

        for (let i = 0; i < filter.length; i++) {
            const item = filter[i]

            // Test if the value is a concatenation operator or a selector
            if (item === "AND" || item === "OR") {
                last_merge_type = item as string
                continue
            }

            // Assuming now that the value is a selector - append the selector into the query
            const [field, operator, value] = item

            if (last_merge_type === "AND" && i !== 0) {
                query += ` ) ${last_merge_type} ( `
            } else if (i === 0) {
                query += "( "
            } else if (i !== 0) {
                query += ` ${last_merge_type} `
                last_merge_type = "AND"
            }

            // Map the query to a SQL string
            let condition_query = `?? ${operator} ?`

            if (operator === "IN" || operator === "NOT IN") {
                condition_query = `?? ${operator} (?)`

                if (!Array.isArray(value) || value.length === 0) {
                    throw new BadQueryError(
                        "An IN query cannot have an empty value. This is normally because a Filter \
                        was constructed with an IN operator that was provided with an empty array \
                        as a value."
                    )
                }
            }

            if (operator === "=" && value === null) {
                condition_query = `?? IS NULL`
            } else if (operator === "!=" && value === null) {
                condition_query = `?? IS NOT NULL`
            }

            query += condition_query

            if (i === filter.length - 1) {
                query += " )"
            }

            // Add the correctly ordered parameters to the SQL parameters
            if (value === null) {
                parameters.push(field)
            } else {
                parameters.push(field, value)
            }
        }

        return [query, parameters]
    }
}
