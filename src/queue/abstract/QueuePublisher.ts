import { QueueHanderPayload, QueueHandler } from "./QueueHandler"

export abstract class QueuePublisher {
    public abstract publish<Q extends QueueHandler<any>>(
        queueName: string,
        eventName: string,
        message: QueueHanderPayload<Q>
    ): Promise<void>
}
