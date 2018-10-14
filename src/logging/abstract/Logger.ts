/**
 * Logger provides an abstract definition of the API Strontium feels a Logger
 * should expose.
 */
import { LogLevel } from "./LogLevel"

export abstract class Logger {
    /**
     * Log a message at a FATAL log level
     *
     * @param message {string} The core message to be logged
     * @param metadata {Object} Optional additional data to be attached to the log message
     */
    public fatal(message: string, metadata?: Object): void {
        this.log(message, LogLevel.FATAL, metadata)
    }

    /**
     * Log a message at a ERROR log level
     *
     * @param message {string} The core message to be logged
     * @param metadata {Object} Optional additional data to be attached to the log message
     */
    public error(message: string, metadata?: Object): void {
        this.log(message, LogLevel.ERROR, metadata)
    }

    /**
     * Log a message at a WARN log level
     *
     * @param message {string} The core message to be logged
     * @param metadata {Object} Optional additional data to be attached to the log message
     */
    public warn(message: string, metadata?: Object): void {
        this.log(message, LogLevel.WARN, metadata)
    }

    /**
     * Log a message at a INFO log level
     *
     * @param message {string} The core message to be logged
     * @param metadata {Object} Optional additional data to be attached to the log message
     */
    public info(message: string, metadata?: Object): void {
        this.log(message, LogLevel.INFO, metadata)
    }

    /**
     * Log a message at a DEBUG log level
     *
     * @param message {string} The core message to be logged
     * @param metadata {Object} Optional additional data to be attached to the log message
     */
    public debug(message: string, metadata?: Object): void {
        this.log(message, LogLevel.DEBUG, metadata)
    }

    public abstract log(
        message: string,
        level: LogLevel,
        metadata?: Object
    ): void
}
