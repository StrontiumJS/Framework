export type ConstructorOf<T> = {
    new (...arg: any[]): T
}

export type UUID = string

export type Nullable<T> = T | null
