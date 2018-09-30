import { Process } from "../abstract/Process"
import { Container } from "inversify"

/**
 * A Runtime represents a collection of Processes run together to form an Application.
 *
 * Runtimes are designed to provide an easy to work with wrapper to build reliable
 * applications and abstract the nasty underlayers of DI and subprocess monitoring
 * that are often discarded due to their complexity.
 */
export class Runtime extends Process {
    private container: Container = new Container()

    constructor(private processes: Array<Process>) {
        super()
    }

    public async startup(): Promise<void> {
        // Start each process in order, waiting for it to be fully booted before moving to the next.
        for (let p of this.processes) {
            await p.startup(this.container)
        }
    }

    public async shutdown(): Promise<void> {
        // Stop each process in order, waiting for it to be full closed before moving to the next.
        for (let p of this.processes) {
            await p.shutdown(this.container)
        }
    }

    public isHealthy(): boolean {
        // Aggregate the health status of each of the sub processes
        return this.processes.reduce((memo: boolean, p) => {
            return memo && p.isHealthy()
        }, true)
    }
}
