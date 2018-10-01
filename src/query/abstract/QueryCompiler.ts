import { Query } from "./Query"

export interface QueryCompiler<R> {
    compile(query: Query<any>): R
}
