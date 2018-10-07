export const compact = <T>(input: T[]): Exclude<T, null | undefined>[] => {
    return input.filter(
        (item: T): item is Exclude<T, null | undefined> =>
            item !== undefined && item !== null
    )
}