import { PGIsolationLevel } from "./PGIsolationLevel"

/**
 * Set characteristics of the PostgreSQL transaction
 */
export interface PGTransactionOptions {
    isolation_level: PGIsolationLevel
}
