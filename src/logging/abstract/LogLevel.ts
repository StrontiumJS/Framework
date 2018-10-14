/**
 * The standarzied levels used across all Logger integrations
 */
export enum LogLevel {
    /**
     * Temporary operation details ( i.e. too verbose to be included in "INFO" level ).
     */
    DEBUG,

    /**
     * Detail on regular operation.
     */
    INFO,

    /**
     * A note on something that should probably be reviewed by an operator.
     */
    WARN,

    /**
     * Fatal for a particular request, but the runtime will continue servicing
     * other requests. An operator should review this.
     */
    ERROR,

    /**
     * The runtime is unable to continue operation.
     * An operator should review this urgently.
     */
    FATAL,
}
