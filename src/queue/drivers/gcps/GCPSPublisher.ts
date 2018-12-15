import { GCPSClient } from "./GCPSClient"
import { QueuePublisher } from "../../abstract/QueuePublisher"
import { Container } from "inversify"
import { Process } from "../../../runtime"

export class GCPSPublisher extends QueuePublisher implements Process {
    private client: GCPSClient

    constructor(
        serviceAccountEmail: string,
        keyId: string,
        privateKey: string
    ) {
        super()

        this.client = new GCPSClient(serviceAccountEmail, keyId, privateKey)
    }

    public isHealthy(): boolean {
        // GCPS is a REST service - it is incapable of having a fundamentally unhealthy state.
        return true
    }

    public async publish<Q extends {}>(
        queueName: string,
        eventName: string,
        messages: Q | Array<Q>
    ): Promise<void> {
        const isArray = (i: Array<Q> | Q): i is Array<Q> =>
            Array.isArray(messages)

        let messageArray: Array<Q>
        messageArray = isArray(messages) ? messages : [messages]

        return this.client.publish(
            queueName,
            messageArray.map((data) => {
                return {
                    attributes: {
                        STRONTIUM_EVENT_NAME: eventName,
                    },
                    data,
                }
            })
        )
    }

    public async shutdown(container: Container): Promise<void> {
        container.unbind(QueuePublisher)
        container.unbind(GCPSPublisher)
    }

    public async startup(container: Container): Promise<void> {
        container.bind(QueuePublisher).toConstantValue(this)
        container.bind(GCPSPublisher).toConstantValue(this)
    }
}
