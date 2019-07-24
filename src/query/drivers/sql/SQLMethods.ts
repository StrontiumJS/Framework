import { Filter } from "../..";
import {
  DataSource,
  DataSourceOutput,
  DataSourceType,
  JoinFilter,
  JoinQuery,
  NullsOrder,
  Query,
  QuerySelectedOutput,
  QuerySelector,
  SortDirection,
  SQLTransform
} from "../../abstract/Query";

export interface SQLTable<R> extends DataSource<R, DataSourceType.TABLE> {
  name: string
  alias: string
}

export class SQL {
  public static Table<R>(name: string): SQLTable<R> {
    return {
      name: name,
      alias: name,
      sourceType: DataSourceType.TABLE
    }
  }

  public static Query<
    P extends DataSource<any, any>,
    S extends QuerySelector<DataSourceOutput<P>>
  >(queryParameters: {
    selector: S
    from: P
    where?: Filter<DataSourceOutput<P>>
    groupBy?: Array<keyof DataSourceOutput<P>> | SQLTransform<Partial<DataSourceOutput<P>>, any>
    having?: Filter<QuerySelectedOutput<DataSourceOutput<P>, S>>
    orderBy?: Array<{
      key: keyof DataSourceOutput<P> | SQLTransform<Partial<DataSourceOutput<P>>, any>
      direction: SortDirection
      nulls: NullsOrder
    }>
    limit?: number
    offset?: number
  }): Query<QuerySelectedOutput<DataSourceOutput<P>, S>> {
    return {
      selector: queryParameters.selector,
      from: queryParameters.from,
      where: queryParameters.where,
      groupBy: queryParameters.groupBy as string[],
      having: queryParameters.having,
      orderBy: queryParameters.orderBy as Array<{
        key: string
        direction: SortDirection
        nulls?: NullsOrder
      }>,
      limit: queryParameters.limit,
      offset: queryParameters.offset,
      sourceType: DataSourceType.PLAIN_QUERY
    }
  }

  public static JoinQuery<
    P extends DataSource<any, any>,
    Q extends DataSource<any, any>,
    Sp extends QuerySelector<DataSourceOutput<P>>,
    Sq extends QuerySelector<DataSourceOutput<Q>>
  >(queryParameters: {
    selector: {
      baseTable: Sp,
      joinTable: Sq
    },
    from: P,
    joinTable: Q,
    on: JoinFilter<DataSourceOutput<P>, DataSourceOutput<Q>>
  }): JoinQuery<QuerySelectedOutput<DataSourceOutput<P>, Sp> | QuerySelectedOutput<DataSourceOutput<Q>, Sq>> {
    return {
      selector: {
        baseTable: queryParameters.selector.baseTable,
        joinTable: queryParameters.selector.joinTable
      },
      from: queryParameters.from,
      joinTable: queryParameters.joinTable,

      sourceType: DataSourceType.JOIN_QUERY,
    }
  }
}
