export const pgQueryPostProcessor = (
    queryString: string,
    queryParameters: Array<any>
): [string, Array<any>] => {
    let parameterCount = 0
    let tokenizedQuery = queryString.split("")
    let outputQuery = ""
    let outputParameters = []

    for (let i = 0; i < tokenizedQuery.length; i++) {
        if (tokenizedQuery[i] === "?") {
            if (tokenizedQuery[i + 1] === "?") {
                // If the MySQL style "??" is used then pass the parameter in directly as
                // PostgreSQL doesn't support column parameter injection
                outputQuery += queryParameters[parameterCount]
                parameterCount++
                i = i + 1
            } else {
                // Add one because Postgres parameters are 1 indexed not 0
                outputQuery += `$${outputParameters.length + 1}`
                outputParameters.push(queryParameters[parameterCount])
                parameterCount++
            }
        } else if (tokenizedQuery[i] === "$") {
            // Search for the first character that isn't a number
            for (let j = i + 1; j < tokenizedQuery.length; j++) {
                if (Number.isNaN(Number(tokenizedQuery[j]))) {
                    i = j + 1
                    break
                } else if (j === tokenizedQuery.length - 1) {
                    i = j
                    break
                }
            }

            // Add the new parameter to the query
            // Add one because Postgres parameters are 1 indexed not 0
            outputQuery += `$${outputParameters.length + 1}`
            outputParameters.push(queryParameters[parameterCount])
            parameterCount++
        } else {
            outputQuery += tokenizedQuery[i]
        }
    }

    return [outputQuery, outputParameters]
}
