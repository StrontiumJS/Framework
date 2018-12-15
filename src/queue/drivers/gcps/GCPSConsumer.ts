import { GCPSClient } from "./GCPSClient"
import { QueueHandler } from "../../abstract/QueueHandler"
import { SerializedTask } from "../../abstract/SerializedTask"
import { TransientError } from "../../../errors/TransientError"
import { Container } from "inversify"
import { Logger } from "../../../logging"
import { Process } from "../../../runtime"
import { ConstructorOf } from "../../../utils/types"
import { isEmpty } from "lodash"
import Timer = NodeJS.Timer

export class GCPSConsumer implements Process {
    public isEnabled: boolean = false
    private ackDeadlineSeconds: number = 0
    private client: GCPSClient
    private logger?: Logger

    constructor(
        serviceAccountEmail: string,
        keyId: string,
        privateKey: string,
        public subscriptionName: string,
        public taskHandlers: {
            [eventName: string]: ConstructorOf<QueueHandler<any>>
        },
        public prefetchCount: number = 15
    ) {
        this.client = new GCPSClient(serviceAccountEmail, keyId, privateKey)
    }

    public isHealthy(): boolean {
        return this.isEnabled
    }

    public async shutdown(container: Container): Promise<void> {
        this.isEnabled = false
        this.logger = undefined
    }

    public async startup(container: Container): Promise<void> {
        // Start the process
        this.isEnabled = true

        // Fetch the subscription configuration
        let subscription = await this.client.getSubscriptionData(
            this.subscriptionName
        )

        if (!isEmpty(subscription.pushConfig)) {
            throw new Error(
                "The Strontium GCPS Consumer does not support Push based GCPS subscriptions. " +
                    "Please change the subscription inside Google Cloud Platform to operate on a Pull Based model if you wish " +
                    "to use this queue processor."
            )
        }

        this.ackDeadlineSeconds = subscription.ackDeadlineSeconds

        this.pollAndExecute(container)
        return
    }

    public async ack(ackId: string): Promise<void> {
        return this.client.acknowledge(this.subscriptionName, [ackId])
    }

    public async nack(ackId: string, requeue: boolean = false): Promise<void> {
        if (requeue) {
            return this.client.modifyAckDeadline(
                this.subscriptionName,
                [ackId],
                0
            )
        } else {
            return this.ack(ackId)
        }
    }

    public async extendAck(ackId: string): Promise<void> {
        return this.client.modifyAckDeadline(
            this.subscriptionName,
            [ackId],
            this.ackDeadlineSeconds
        )
    }

    public async pollAndExecute(container: Container): Promise<void> {
        while (this.isEnabled) {
            let messages = await this.client.pullTasks(
                this.subscriptionName,
                this.prefetchCount,
                false
            )

            await Promise.all(
                messages.map(async (m) =>
                    this.executeTask(
                        m.ackId,
                        {
                            eventName:
                                m.message.attributes.STRONTIUM_EVENT_NAME,
                            message: m.message.data,
                        },
                        container
                    )
                )
            )
        }
    }

    public async executeTask(
        ackId: string,
        task: SerializedTask,
        applicationContainer: Container
    ): Promise<void> {
        // Create a new DI Container for the life of this request
        let requestContainer = new Container({
            autoBindInjectable: true,
            skipBaseClassChecks: true,
        })

        requestContainer.parent = applicationContainer
        if (requestContainer.isBound(Logger)) {
            this.logger = requestContainer.get(Logger)
        }

        // Spawn a handler for the Task type
        let handlerType = this.taskHandlers[task.eventName]
        if (this.logger) {
            this.logger.info(
                `[GCPS - TASK - START] Event of type ${
                    task.eventName
                } received by Consumer.`
            )
        }

        if (handlerType === undefined) {
            if (this.logger) {
                this.logger.error(
                    `[GCPS - TASK - NO_IMPLEMENTATION_FAIL] No implementation found for event ${
                        task.eventName
                    }`
                )
            }
            await this.nack(ackId)
            return
        }

        let requestHandler = requestContainer.get(handlerType)

        // Set a regular task to extend the lifespan of the job until we are done processing it.
        let ackInterval: Timer = setInterval(() => {
            this.extendAck(ackId)
        }, this.ackDeadlineSeconds * 1000)

        try {
            // Validation errors aren't caught explicitly as they should never happen in Production.
            // They are instead designed to prevent edge case errors and are thrown as such.
            let validatedMessage = await requestHandler.inputValidator(
                task.message
            )

            await requestHandler.handle(validatedMessage)

            await this.ack(ackId)
            if (this.logger) {
                this.logger.info(
                    `[GCPS - TASK - SUCCESS] Event of type ${
                        task.eventName
                    } successfully completed by Consumer.`
                )
            }
        } catch (e) {
            if (e instanceof TransientError) {
                if (this.logger) {
                    this.logger.error(
                        "[GCPS - TASK - TRANSIENT_FAIL] Task failed with transient error. Attempting to reschedule execution.",
                        e
                    )
                }

                await this.nack(ackId, true)
            } else {
                if (this.logger) {
                    this.logger.error(
                        "[GCPS - TASK - PERMANENT_FAIL] Task failed with permanent error.",
                        e
                    )
                }

                // For permanent errors we stop attempting to process the object
                await this.nack(ackId)
            }
        } finally {
            clearInterval(ackInterval)
        }
    }
}
