export type ValidatorFunction<I, O> = (input: I) => O | Promise<O>

export type ValidatorOutput<
    I,
    P extends ValidatorFunction<I, any>
> = P extends ValidatorFunction<I, infer O> ? O : ReturnType<P>
