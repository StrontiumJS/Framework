import { Queryable } from "../Queryable"

/**
 * A SQLTransaction represents a Queryable objects that is operating within a transaction of a
 * SQLDatastore.
 */
export abstract class SQLTransaction extends Queryable {
    /**
     * Create a new Transaction within the existing Transaction.
     *
     * This creates a new SAVE POINT within the Transaction to emulate nested transactions.
     */
    public abstract async createTransaction(): Promise<SQLTransaction>

    /**
     * Commit the transaction to persist the changes made.
     *
     * For nested transactions this method does not guarentee that the changes are visible outside
     * of the parent transaction - it simply means that should the parent transaction commit then
     * these changes will also commit.
     */
    public abstract async commit(): Promise<void>

    /**
     * Rollback the changes made during this transaction.
     */
    public abstract async rollback(): Promise<void>
}
