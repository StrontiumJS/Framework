import { isExactly } from "./isExactly"

export const isEnumValue = <T>(enumObject: any): ((i: unknown) => T) => {
    let values = Object.values(enumObject)

    return isExactly(values) as any
}
