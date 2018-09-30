import { Logger, LoggerArgs, LoggerLevel } from "../abstract/Logger"

/**
 * A simple logger used to ouput log messages to the server console
 */
export class ConsoleLogger extends Logger {
    /**
     * Creates an instance of ConsoleLogger.
     *
     * @param level {LoggerLevel} The min level of logs the logger should output to the console
     * @param injectedConsole {Console} System console to log to (optional)
     */
    public constructor(private level: LoggerLevel, private injectedConsole: Console = console) {
        super()
    }

    public debug(args: LoggerArgs, message: string): void {
        this.consoleLog(LoggerLevel.DEBUG, args, message)
    }

    public info(args: LoggerArgs, message: string): void {
        this.consoleLog(LoggerLevel.INFO, args, message)
    }

    public warn(args: LoggerArgs, message: string): void {
        this.consoleLog(LoggerLevel.WARN, args, message)
    }

    public error(args: LoggerArgs, message: string): void {
        this.consoleLog(LoggerLevel.ERROR, args, message)
    }

    public fatal(args: LoggerArgs, message: string): void {
        this.consoleLog(LoggerLevel.FATAL, args, message)
    }

    private consoleLog(level: LoggerLevel, args: LoggerArgs, message: string): void {
        if (!this.shouldLog(level)) {
            return
        }

        switch (level) {
            case LoggerLevel.DEBUG:
                this.injectedConsole.log(message, args)
                break
            case LoggerLevel.INFO:
                this.injectedConsole.info(message, args)
                break
            case LoggerLevel.WARN:
                this.injectedConsole.warn(message, args)
                break
            case LoggerLevel.ERROR:
            case LoggerLevel.FATAL:
                this.injectedConsole.error(message, args)
                break
        }
    }

    private shouldLog(level: LoggerLevel): boolean {
        // Don't log messages of precedence less than the current logger level
        return level >= this.level
    }
}
