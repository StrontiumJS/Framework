import { Filter } from "./Filter";

export enum DataSourceType {
  PLAIN_QUERY = "PLAIN_QUERY",
  JOIN_QUERY = "JOIN_QUERY",
  UNION_QUERY = "UNION_QUERY",
  TABLE = "TABLE"
}

export interface DataSource<Response, Type extends DataSourceType> {
  sourceType: Type
  responseType?: Response
}

export interface Query<R> extends DataSource<R, DataSourceType.PLAIN_QUERY> {
  selector: QuerySelector<any>
  from: DataSource<any, any>
  where?: Filter<any>
  groupBy?: Array<string>
  having?: Filter<any>
  orderBy?: Array<{
    key: string
    direction: SortDirection
    nulls?: NullsOrder
  }>
  limit?: number
  offset?: number
}

export interface JoinQuery<R> extends DataSource<R, DataSourceType.JOIN_QUERY> {
  selector: {
    baseTable: QuerySelector<any>
    joinTable: QuerySelector<any>
  }
  baseTable: DataSource<any, DataSourceType>
  joinTable: DataSource<any, DataSourceType>
  joinType: JoinType
  onClause: JoinFilter<any, any>
}

export interface UnionQuery<R> extends DataSource<R, DataSourceType.UNION_QUERY> {
  tables: Array<DataSource<any, any>>
}

/**
 * This type represents a materialized source of SQL Data - It could either be a table or a subquery.
 *
 * The output is an object with the correct type mapping for the source data.
 */
export type DataSourceOutput<D> = D extends DataSource<infer Q, any> ? Q : never

/**
 * This type represents the SELECT field of a query
 */
export type QuerySelector<D> = Array<keyof D> | {
  [alias: string]: keyof D | SQLTransform<Partial<D>, any>
}

export enum SortDirection {
  DESC = "DESC",
  ASC = "ASC"
}

export enum NullsOrder {
  FIRST = "FIRST",
  LAST = "LAST"
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
  [K in keyof S]: S[K] extends keyof D ? D[S[K]] : S[K] extends SQLTransform<any, infer R> ? R : never
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

export type SQLTransform<T, R> = {
  queryText: string
  parameters: Array<any>
  operatingSet?: T
  inputKey?: keyof T
  responseType?: R
}
