import {
    ObjectValidator,
    ValidatedObject,
    ValidatorFunction,
    ValidatorOutput,
} from "../../validation"

export abstract class EndpointController {
    public abstract inputValidator: {
        body: ValidatorFunction<unknown, any>
        headers: ObjectValidator
        query: ObjectValidator
        params: ObjectValidator
        meta: ObjectValidator
    }

    public abstract outputValidator: ValidatorFunction<any, any>

    public abstract async handle(input: any): Promise<any>
}

export type ControllerInput<E extends EndpointController> = {
    body: ValidatorOutput<unknown, E["inputValidator"]["body"]>
    headers: ValidatedObject<E["inputValidator"]["headers"]>
    query: ValidatedObject<E["inputValidator"]["query"]>
    params: ValidatedObject<E["inputValidator"]["params"]>
    meta: ValidatedObject<E["inputValidator"]["meta"]>
}

export type ControllerOutput<E extends EndpointController> = ValidatorOutput<
    unknown,
    E["outputValidator"]
>
