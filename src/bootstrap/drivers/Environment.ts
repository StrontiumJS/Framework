import { Container } from "inversify"
import { Process } from "../../runtime"
import { ObjectValidator, ValidatedObject, isObject } from "../../validation"

export class Environment<O extends ObjectValidator> implements Process {
    private validatedEnvironment?: ValidatedObject<O>

    constructor(private validator: O) {}

    public getKey<K extends keyof ValidatedObject<O>>(key: K): O[K] {
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

        this.validatedEnvironment = await isObject(this.validator)(process.env)
    }

    public async shutdown(container: Container): Promise<void> {
        container.unbind(Environment)

        this.validatedEnvironment = undefined
    }
}
