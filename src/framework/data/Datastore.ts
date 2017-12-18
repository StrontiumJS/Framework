import { Queryable } from "./Queryable"

/**
 * Datastore provides an abstract base class for all persistent Datastore connections.
 *
 * Each connection is required to expose a mechanism to start, stop and query the Datastore.
 *
 * Datastore inherits from Queryable meaning that any reference to a Datastore must be able to
 * directly handle queries - however some implementations such as the SQL store may wish to expose
 * additional pathways for executing queries such as creating a transaction.
 */
export abstract class Datastore extends Queryable {
    /**
     * Initialize this Datastores connection to the underlying store.
     *
     * This method should have internal checks to prevent a double call and should not attempt to reconnect without
     * close first being called.
     *
     * The promise should resolve once the connection is open or throw an error if there is a timeout or other connection
     * issue.
     *
     * @returns {Promise<null>}
     */
    public abstract async open(): Promise<null>

    /**
     * Close this Datastore's connection to the underlying store.
     *
     * This method should do nothing if the connection is not open.
     *
     * The promise should resolve once the connection has been closed.
     *
     * @returns {Promise<null>}
     */
    public abstract async close(): Promise<null>
}
