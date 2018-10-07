export type ValidatorFunction<I, O> = (input: I) => O | Promise<O>

export type ValidatorOutput<
    I,
    P extends ValidatorFunction<I, any>
> = ReturnType<P> extends Promise<infer O> ? O : ReturnType<P>
