import { ValidatorFunction } from "../../validation"

export abstract class QueueHandler<P> {
    public abstract inputValidator: ValidatorFunction<any, P>

    public abstract async handle(message: P): Promise<void>
}

export type QueueHanderPayload<
    Q extends QueueHandler<any>
> = Q extends QueueHandler<infer P> ? P : never
