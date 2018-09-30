export type LoggerArgs = Object | null

/**
 * The standarzied levels used across all Logger integrations
 */
export enum LoggerLevel {
    /**
     * Temporary operation detail, i.e. too verbose to be included in "INFO" level.
     */
    DEBUG,

    /**
     * Detail on regular operation.
     */
    INFO,

    /**
     * A note on something that should probably be looked at by an operator eventually.
     */
    WARN,

    /**
     * Fatal for a particular request, but the service/app continues servicing
     * other requests. An operator should look at this soon(ish).
     */
    ERROR,

    /**
     * The service/app is going to stop or become unusable now.
     * An operator should definitely look into this soon.
     */
    FATAL,
}

/**
 * The abstract Logger in Strontium
 */
export abstract class Logger {
    /**
     * Log a message at a FATAL log level
     *
     * @param args {LoggerArgs} Additional data to be logged with the log message
     * @param message {string} Log message to be logged
     */
    public abstract fatal(args: LoggerArgs, message: string): void

    /**
     * Log a message at a ERROR log level
     *
     * @param args {LoggerArgs} Additional data to be logged with the log message
     * @param message {string} Log message to be logged
     */
    public abstract error(args: LoggerArgs, message: string): void

    /**
     * Log a message at a WARN log level
     *
     * @param args {LoggerArgs} Additional data to be logged with the log message
     * @param message {string} Log message to be logged
     */
    public abstract warn(args: LoggerArgs, message: string): void

    /**
     * Log a message at a INFO log level
     *
     * @param args {LoggerArgs} Additional data to be logged with the log message
     * @param message {string} Log message to be logged
     */
    public abstract info(args: LoggerArgs, message: string): void

    /**
     * Log a message at a DEBUG log level
     *
     * @param args {LoggerArgs} Additional data to be logged with the log message
     * @param message {string} Log message to be logged
     */
    public abstract debug(args: LoggerArgs, message: string): void
}
