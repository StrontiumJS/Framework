/**
 * A Queryable represents an interface for an underlying query mechanism that is capable of receiving
 * queries and arguments and returning the matching records from it's set.
 *
 * Queryable can also be implemented by higher level objects.
 * For example SQLTransactions extend Queryable so that implementations
 * can be blind as to whether their execution is contained within a transaction.
 *
 * @abstract
 */
export abstract class Queryable {
    /**
     * Submit a query command to an underlying datastore implementation and wait for the
     * response. The response is not necessarily typed and should be reversed back to a typed value
     * by the caller.
     *
     * @abstract
     * @param {string} query The command to be executed against the implementing resource
     * @param {string} parameters The arguments or parameters to the command being executed
     * @returns {Promise<Array<any>>}
     */
    public abstract async query(
        query: string,
        parameters: Array<any>
    ): Promise<Array<any>>
}
