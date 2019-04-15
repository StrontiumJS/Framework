import { Logger } from "../abstract/Logger"
import { Container } from "inversify"
import { Process, isProcess } from "../../runtime"

import { LogLevel } from ".."

/**
 * The AggregateLogger accepts several other Logger instances - potentially Processes themselves -
 * and distributes the log to each of the registered loggers above a given level.
 */
export class AggregateLogger extends Logger implements Process {
    constructor(private loggers: Array<Logger>) {
        super()
    }

    public isHealthy(): boolean {
        return this.loggers.reduce((memo, l) => {
            if (isProcess(l)) {
                return memo && l.isHealthy()
            } else {
                return memo
            }
        }, true as boolean)
    }

    public async shutdown(container: Container): Promise<void> {
        // Stop any loggers that are Processes
        for (let l of this.loggers) {
            if (isProcess(l)) {
                await l.shutdown(container)
            }
        }

        container.unbind(Logger)
    }

    public async startup(container: Container): Promise<void> {
        // Boot each of the loggers if they are Processes
        for (let l of this.loggers) {
            if (isProcess(l)) {
                await l.startup(container)
            }
        }

        // Bind this container to the logging implementation
        container.bind(Logger).toConstantValue(this)
    }

    public log(message: string, level: LogLevel, metadata?: Object): void {
        for (let l of this.loggers) {
            l.log(message, level, metadata)
        }
    }
}
