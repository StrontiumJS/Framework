export type LoggerArgs = Object | null

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
