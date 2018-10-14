import { Filter } from "./Filter"

export type FilterCompiler<R> = (filter: Filter<any>) => R
