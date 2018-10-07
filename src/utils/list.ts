export type Func<I, O> = (input: I) => O
export type Predicate<T> = Func<T, boolean>
export type TypeGuard<T, V extends T> = (val: T) => val is V

export function filter<T, S extends T>(arr: T[], func: TypeGuard<T, S>): S[]
export function filter<T>(arr: T[], func: Predicate<T>): T[]
export function filter<T>(arr: T[], func: Predicate<T>): T[] {
    return arr.filter(func)
}

export function compact<T>(input: (T | null | undefined)[]): T[] {
    return filter(
        input,
        (item: T | null | undefined): item is T =>
            item !== undefined && item !== null
    )
}
