import { Container } from "inversify"
import { Logger } from "../../../logging"
import { ClientOpts, RedisClient, createClient } from "redis"
import { Process } from "../../../runtime"
import { promisify } from "util"

export class RedisStore implements Process {
    private client?: RedisClient
    private logger?: Logger
    private healthyState: boolean = false

    constructor(private connectionOptions?: ClientOpts) {}

    public isHealthy(): boolean {
        return this.healthyState
    }

    public getClient(): RedisClient {
        if (this.client === undefined) {
            throw new Error(
                "The RedisStore is not currently open and cannot be used. Check that the store has had .startup() called and that the Promise has successfully returned."
            )
        }

        return this.client
    }

    public async startup(container: Container): Promise<void> {
        if (this.client === undefined) {
            this.client = createClient(this.connectionOptions)

            // Handle errors and mark the connection as unhealthy
            this.client.on("error", (err) => {
                if (container.isBound(Logger)) {
                    this.logger = container.get(Logger)
                    this.logger.error("RedisStore encountered an error", err)
                }

                this.healthyState = false
            })

            this.client.on("end", (err) => {
                if (container.isBound(Logger)) {
                    this.logger = container.get(Logger)
                    this.logger.error("RedisStore encountered an error", err)
                }

                this.healthyState = false
            })

            // listen for the connection to mark it as healthy
            this.client.on("connect", () => {
                this.healthyState = true
            })

            container.bind(RedisStore).toConstantValue(this)
        } else {
            throw new Error(
                "A RedisClient already exists and cannot be reinstated without first being closed. This usually happens from calling startup on an existing Runtime."
            )
        }
    }

    public async shutdown(container: Container): Promise<void> {
        if (this.client) {
            container.unbind(RedisStore)

            await promisify(this.client.quit.bind(this.client))()

            // Dereference the client
            this.client = undefined
            this.healthyState = false
        }
    }

    public async sendCommand<R>(
        command: string,
        args?: Array<number | string | null>
    ): Promise<R> {
        if (this.client === undefined) {
            throw new Error(
                "RedisStore cannot send a command on a closed connection. This usually happens from forgetting to call startup."
            )
        }

        let result: R = await promisify(
            this.client.sendCommand.bind(this.client)
        )(command, args)

        return result
    }

    public async eval<R>(
        script: string,
        args: Array<string | number>
    ): Promise<R> {
        if (this.client === undefined) {
            throw new Error(
                "RedisStore cannot send a command on a closed connection. This usually happens from forgetting to call startup."
            )
        }

        let result: R = await promisify(this.client.eval.bind(this.client))(
            script,
            ...args
        )

        return result
    }
}
