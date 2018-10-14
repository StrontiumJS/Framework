export type TypeGuard<T, V extends T> = (val: T) => val is V

export function notMissing<T>(input: T): input is Exclude<T, null | undefined> {
    return input !== null && input !== undefined
}
