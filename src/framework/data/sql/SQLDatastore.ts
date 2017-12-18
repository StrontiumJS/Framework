import { Datastore } from "../Datastore"
import { SQLTransaction } from "./SQLTransaction"

/**
 * A SQLDatastore represents an interface to an underlying SQL Datastore and exposes a mechanism
 * to create Transactions.
 */
export abstract class SQLDatastore extends Datastore {
    /**
     * Create a new SQLTransaction which is a representation of a Transaction on the underlying
     * datastore.
     */
    public abstract async createTransaction(): Promise<SQLTransaction>
}
