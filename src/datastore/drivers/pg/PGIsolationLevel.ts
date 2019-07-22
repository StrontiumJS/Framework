/**
 * PostgreSQL transaction isolation levels
 */
export enum PGIsolationLevel {
    SERIALIZABLE = "SERIALIZABLE",
    REPEATABLE_READ = "REPEATABLE_READ",
    READ_COMMITED = "READ_COMMITED",
    READ_UNCOMMITTED = "READ_UNCOMMITTED",
}
