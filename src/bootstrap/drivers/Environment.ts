import { Container } from "inversify"
import { Logger } from "../../logging";
import { Process } from "../../runtime"
import { ObjectValidator, ValidatedObject, isObject } from "../../validation"

export class Environment<O extends ObjectValidator> implements Process {
    private validatedEnvironment?: ValidatedObject<O>

    constructor(private validator: O) {}

    public getKey<K extends keyof ValidatedObject<O>>(
        key: K
    ): ValidatedObject<O>[K] {
        if (this.validatedEnvironment !== undefined) {
            return this.validatedEnvironment[key]
        } else {
            throw new Error(
                "An environment value was accessed before the Environment container completed initialization."
            )
        }
    }

    public isHealthy(): boolean {
        return this.validatedEnvironment !== undefined
    }

    public async startup(container: Container): Promise<void> {
        container.bind(Environment).toConstantValue(this)

        try {
            this.validatedEnvironment = await isObject(this.validator)(process.env)
        } catch (e) {
            if (container.isBound(Logger)) {
                container.get(Logger).error("Environment validation failed!", e)
            } else {
                console.error(e)
            }

            throw e
        }
    }

    public async shutdown(container: Container): Promise<void> {
        container.unbind(Environment)

        this.validatedEnvironment = undefined
    }
}
