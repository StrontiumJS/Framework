import {
    ObjectValidator,
    ValidatedObject,
    ValidatorFunction,
    ValidatorOutput,
} from "../../validation"

export abstract class EndpointController {
    public abstract inputValidator: ObjectValidator

    public abstract outputValidator: ValidatorFunction<any, any>

    public abstract async handle(input: any): Promise<any>
}

export type ControllerInput<E extends EndpointController> = ValidatedObject<
    E["inputValidator"]
>

export type ControllerOutput<E extends EndpointController> = ValidatorOutput<
    unknown,
    E["outputValidator"]
>
