import { QueueHandler } from "../../abstract/QueueHandler"
import { SerializedTask } from "../../abstract/SerializedTask"
import { TransientError } from "../../../errors/TransientError"
import { Container } from "inversify"
import { Logger } from "../../../logging"
import { Process } from "../../../runtime"
import { ConstructorOf } from "../../../utils/types"
import Timer = NodeJS.Timer

export class GCPSConsumer implements Process {
    public isEnabled: boolean = false
    private ackDeadlineSeconds: number = 0

    constructor(
        public subscriptionName: string,
        public taskHandlers: {
            [eventName: string]: ConstructorOf<QueueHandler<any>>
        },
        public prefetchCount: number = 15
    ) {}

    public isHealthy(): boolean {
        return this.isEnabled
    }

    public async shutdown(container: Container): Promise<void> {
        this.isEnabled = false
    }

    public async startup(container: Container): Promise<void> {
        // Start the process
        this.isEnabled = true
        this.pollAndExecute(container)
        return
    }

    public async ack(ackId: string): Promise<void> {}

    public async nack(ackId: string, requeue: boolean = false): Promise<void> {}

    public async extendAck(ackid: string): Promise<void> {}

    public async pollAndExecute(container: Container): Promise<void> {
        // Fetch the prefetch count

        // Process in parallel - waiting for all to complete

        // Run it again!
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

        // Spawn a handler for the Task type
        let handlerType = this.taskHandlers[task.eventName]

        if (handlerType === undefined) {
            let logger: Logger | undefined = requestContainer.get(Logger)

            if (logger) {
                logger.error(
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
        } catch (e) {
            let logger: Logger | undefined = requestContainer.get(Logger)

            if (e instanceof TransientError) {
                if (logger) {
                    logger.error(
                        "[GCPS - TASK - TRANSIENT_FAIL] Task failed with transient error. Attempting to reschedule execution.",
                        e
                    )
                }

                await this.nack(ackId, true)
            } else {
                if (logger) {
                    logger.error(
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
