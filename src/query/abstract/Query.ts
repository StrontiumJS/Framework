import { SQLTable } from "../drivers/sql/SQLMethods";
import { Filter } from "./Filter";

export interface Query<R> {
  selector: Array<string> | {
    [alias: string]: string
  }
  from: SQLTable<any> | Query<any>
  where: Filter<any>
  groupBy: Array<string>
  having: Filter<any>
  orderBy: Array<{
    key: string
    direction: "ASC" | "DESC"
    nulls?: "FIRST" | "LAST"
  }>
  limit: number
  offset: number

  // Typescript meta tag - never used at runtime
  responseType?: R
}

/**
 * This type represents a materialized source of SQL Data - It could either be a table or a subquery.
 *
 * The output is an object with the correct type mapping for the source data.
 */
export type DataSource<D> = D extends Query<infer Q> ? Q : D extends SQLTable<infer T> ? T : never

/**
 * This type represents the SELECT field of a query
 */
export type QuerySelector<D> = Array<keyof D> | {
  [alias: string]: keyof D
}

/**
 * This type represents the final output of a query based on mapping the types specified in the Selector
 * through from the Data Sources.
 *
 * N.B The TS-Ignore here is because TypeScript itself is not yet able to handle constrained infered types.
 * Given the family of types that this exists in we know that under regular circumstances it will operate correctly.
 * Hopefully this improves in the future.
 *
 * Credit to @viralpickaxe for coming up with this insane hack to disable the type system inside of itself.
 */
export type QuerySelectedOutput<D, S extends QuerySelector<D>> = S extends Array<infer T> ? {
  // @ts-ignore
  [K in T]:
    K extends keyof D ? D[K] : never
} : {
  [K in keyof S]: S[K] extends keyof D ? D[S[K]] : never
}

export enum JoinType {
  INNER = "INNER",
  LEFT = "LEFT"
}

export type JoinFilter<Q, P> = {
  $and?: Array<JoinFilter<Q, P>>
  $or?: Array<JoinFilter<Q, P>>
} & {
  [K in keyof Q]?: {
    $eq?: keyof P
    $neq?: keyof P
    $gt?: keyof P
    $gte?: keyof P
    $lt?: keyof P
    $lte?: keyof P
  }
}

export interface JoinQuery<R> {
  selector: {
    baseTable: {
      [alias: string]: string
    }
    joinTable: {
      [alias: string]: string
    }
  }
  baseTable: SQLTable<any> | Query<any>
  joinTable: SQLTable<any> | Query<any>
  joinType: JoinType
  onClause: JoinFilter<any, any>

  responseType?: R
}

export interface UnionQuery<R> {
  table: Array<SQLTable<any> | Query<any>>
}
