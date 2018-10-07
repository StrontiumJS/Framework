export type ValidatorFunction<I, O> = SyncValidator<I, O> | AsyncValidator<I, O>
export type SyncValidator<I, O> = (input: I) => O
export type AsyncValidator<I, O> = (input: I) => Promise<O>

export type ValidatorOutput<
    I,
    P extends ValidatorFunction<I, any>
> = ReturnType<P> extends Promise<infer O> ? O : ReturnType<P>
