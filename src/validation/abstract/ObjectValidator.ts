import { ValidatorFunction, ValidatorOutput } from "./ValidatorFunction"

export type ObjectValidator = {
    [key: string]: ValidatorFunction<any, any>
}

export type ValidatedObject<O extends ObjectValidator> = {
    [P in keyof O]: ValidatorOutput<unknown, O[P]>
}
