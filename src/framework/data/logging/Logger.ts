/**
 * A Logger is an instantiated logging object which allows for robust logging from the application without relying
 * on the synchronous but somewhat ubiquitous standard library console.log method.
 *
 * A standard Logger will only log to the console and is currently just a thin wrapper around WinstonJS.
 *
 * It is recommended to extend the Logger with your own transports that map to an external third party service - we highly recommend
 * Papertrail for this.
 */
import {
    Logger as WinstonLogger,
    LoggerInstance as IWinstonLogger,
    TransportInstance,
} from "winston"

import Winston from "winston"

export class Logger {
    public winston: IWinstonLogger

    constructor(subsystem: string, transports: Array<TransportInstance> = []) {
        this.winston = new WinstonLogger({
            transports: [new Winston.transports.Console(), ...transports],
        })
    }

    public info(...args: Array<string>): void {
        ;(this.winston.log as any)("info", ...args)
    }

    public warn(...args: Array<string>): void {
        ;(this.winston.log as any)("warn", ...args)
    }

    public error(...args: Array<string>): void {
        ;(this.winston.log as any)("error", ...args)
    }
}
