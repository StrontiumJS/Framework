import { notMissing } from "./typeGuard"

export const compact = <T>(input: T[]): Exclude<T, null | undefined>[] => {
    return input.filter(notMissing)
}
