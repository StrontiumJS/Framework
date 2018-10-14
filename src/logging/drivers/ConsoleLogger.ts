import { LogLevel } from "../abstract/LogLevel"
import { Logger } from "../abstract/Logger"

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

    public log(message: string, level: LogLevel, metadata: Object): void {
        if (!this.shouldLog(level)) {
            return
        }

        switch (level) {
            case LogLevel.DEBUG:
                this.injectedConsole.log(message, metadata)
                break
            case LogLevel.INFO:
                this.injectedConsole.info(message, metadata)
                break
            case LogLevel.WARN:
                this.injectedConsole.warn(message, metadata)
                break
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                this.injectedConsole.error(message, metadata)
                break
        }
    }

    private shouldLog(level: LogLevel): boolean {
        // Don't log messages of precedence less than the current logger level
        return level >= this.level
    }
}
