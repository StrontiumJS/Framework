/**
 * A BadQueryError represents a logical error in the construction or execution of a query where the
 * responsibility for the failure rests on the programmer.
 *
 * This can represent either an error in the framework query layer or an error in the underlying
 * execution of the datastore.
 */
export class BadQueryError extends Error {
    constructor(m: string) {
        super(m)

        Object.setPrototypeOf(this, BadQueryError.prototype)
    }
}
