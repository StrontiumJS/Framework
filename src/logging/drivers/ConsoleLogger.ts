import { LogLevel } from "../abstract/LogLevel"
import { Logger, LoggerArgs } from "../abstract/Logger"

/**
 * A simple Logging Driver used to ouput log messages to STDOUT and STDERR.
 */
export class ConsoleLogger extends Logger {
    /**
     * Creates an instance of ConsoleLogger.
     *
     * @param level {LogLevel} The min level of logs the logger should output to the console
     * @param injectedConsole {Console} System console to log to (optional)
     */
    public constructor(
        private level: LogLevel,
        private injectedConsole: Console = console
    ) {
        super()
    }

    public debug(args: LoggerArgs, message: string): void {
        this.consoleLog(LogLevel.DEBUG, args, message)
    }

    public info(args: LoggerArgs, message: string): void {
        this.consoleLog(LogLevel.INFO, args, message)
    }

    public warn(args: LoggerArgs, message: string): void {
        this.consoleLog(LogLevel.WARN, args, message)
    }

    public error(args: LoggerArgs, message: string): void {
        this.consoleLog(LogLevel.ERROR, args, message)
    }

    public fatal(args: LoggerArgs, message: string): void {
        this.consoleLog(LogLevel.FATAL, args, message)
    }

    private consoleLog(
        level: LogLevel,
        args: LoggerArgs,
        message: string
    ): void {
        if (!this.shouldLog(level)) {
            return
        }

        switch (level) {
            case LogLevel.DEBUG:
                this.injectedConsole.log(message, args)
                break
            case LogLevel.INFO:
                this.injectedConsole.info(message, args)
                break
            case LogLevel.WARN:
                this.injectedConsole.warn(message, args)
                break
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                this.injectedConsole.error(message, args)
                break
        }
    }

    private shouldLog(level: LogLevel): boolean {
        // Don't log messages of precedence less than the current logger level
        return level >= this.level
    }
}
