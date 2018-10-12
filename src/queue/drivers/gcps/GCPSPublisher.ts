import { QueueHanderPayload, QueueHandler } from "../../abstract/QueueHandler"
import { QueuePublisher } from "../../abstract/QueuePublisher"
import { Container } from "inversify"
import { Process } from "../../../runtime"

export class GCPSPublisher extends QueuePublisher implements Process {
    public isHealthy(): boolean {
        // GCPS is a REST service - it is incapable of having a fundamentally unhealthy state.
        return true
    }

    public async publish<Q extends QueueHandler<any>>(
        queueName: string,
        eventName: string,
        message: QueueHanderPayload<Q>
    ): Promise<void> {}

    public async shutdown(container: Container): Promise<void> {
        container.unbind(QueuePublisher)
        container.unbind(GCPSPublisher)
    }

    public async startup(container: Container): Promise<void> {
        container.rebind(QueuePublisher).toConstantValue(this)
        container.rebind(GCPSPublisher).toConstantValue(this)
    }
}
