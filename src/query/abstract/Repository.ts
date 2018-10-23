import { Filter } from "./Filter"

/**
 * A Repository represents an access mechanism for the underlying data in a store.
 *
 * It is responsible for fetching the data from a store and using it to instantiate Model objects.
 * Repositories in the abstract sense are not tied to any given type of datastore however classes
 * that extend Repository may begin to make more assertions about the nature of the underlying store.
 */
export abstract class Repository<T, K extends keyof T> {
    /**
     * Create a new record in the underlying data store.
     *
     * @param payload The objects to be created in the datastore
     */
    abstract async create(payload: Partial<T>): Promise<T[K]>

    /**
     * Read a collection of records from the underlying data store which match the provided filter.
     *
     * @param filter A filter to select which objects should be returned in the read response
     */
    abstract async read(filter: Filter<T>): Promise<Array<T>>

    /**
     * Update a collection of records in the underlying data store to the provided values where
     * the original record matches the filter provided.
     *
     * @param payload An payload object representing the delta that should be applied to updated records.
     * @param filter A filter to select which records should be updated.
     */
    abstract async update(payload: Partial<T>, filter: Filter<T>): Promise<void>

    /**
     * Delete a collection of records from the underlying data store where the record matches
     * the filter provided.
     *
     * @param filter A filter to select which records should be deleted
     */
    abstract async delete(filter: Filter<T>): Promise<void>
}
