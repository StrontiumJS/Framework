import {
    ObjectValidator,
    ValidatedObject,
    ValidatorFunction,
} from "../../validation"

export abstract class EndpointController {
    public abstract inputValidator: ObjectValidator

    public abstract outputValidator: ValidatorFunction<any, any>

    public abstract async handle(input: ValidatedObject<any>): Promise<any>
}
