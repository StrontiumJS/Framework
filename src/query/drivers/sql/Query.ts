import { Filter } from "../..";
import { UUID } from "../../../utils/types";
import {
  DataSource,
  DataSourceOutput,
  NullsOrder,
  Query,
  QuerySelectedOutput,
  QuerySelector,
  SortDirection,
  SQLTransform
} from "../../abstract/Query";
import { SQL } from "./SQLMethods";

export const createQuery = <
  P extends DataSource<any, any>,
  S extends QuerySelector<DataSourceOutput<P>>,
  G extends QuerySelector<DataSourceOutput<P>>,
>(queryParameters: {
  selector: S
  from: P
  where?: Filter<DataSourceOutput<P>>
  groupBy?: G
  having?: Filter<QuerySelectedOutput<DataSourceOutput<P>, S>>
  orderBy?: Array<{
    key: keyof DataSourceOutput<P> | SQLTransform<Partial<DataSourceOutput<P>>, any>
    direction: SortDirection
    nulls: NullsOrder
  }>
  limit?: number
  offset?: number
}): Query<QuerySelectedOutput<DataSourceOutput<P>, S>> => {
  return {}
}

export const LOWER = <T>(column: keyof T): SQLTransform<T, string> => ({
  queryText: `LOWER(??)`,
  parameters: [column]
})

export const COUNT = <T>(column: keyof T): SQLTransform<T, number> => ({
  queryText: `COUNT(??)`,
  parameters: [column]
})

export const AVG = <T>(column: keyof T): SQLTransform<T, number> => ({
  queryText: `AVG(??)`,
  parameters: [column]
})

export const LEVENSHTEIN = <T>(column: keyof T, candidate: keyof T, insCost: number, delCost: number): SQLTransform<T, number> => ({
  queryText: `LEVENSHTEIN(??)`,
  parameters: [column]
})

export const MINUS = <T>(columnA: keyof T, columnB: keyof T): SQLTransform<T, number> => ({
  queryText: `MINUS(??, ??)`,
  parameters: [columnA, columnB]
})

export const LITERAL = <R>(value: R): SQLTransform<any, R> => ({
  queryText: `?`,
  parameters: [value]
})

let test = createQuery({
  selector: {
    "my_alias": "thing",
    "test_shit": LOWER("test"),
    "my_aggregate_shit": COUNT("thing")
  },
  from: SQL.Table<{test: UUID, thing: Date}>("test"),
})

let innerQuery = createQuery({
  selector: {
    "average": AVG("nameDistance"),
    "calced": MINUS("nameDistance", "my_literal_value")
  },
  from: createQuery({
    selector: {
      "nameDistance": LEVENSHTEIN("name", "organization_id", 1, 2),
      "organization_id": "organization_id",
      "my_literal_value": LITERAL(new Date())
    },
    from: SQL.Table<{name: string, organization_id: UUID}>("company"),
    groupBy: ["organization_id"]
  }),
  groupBy: ["organization_id"],
  orderBy: [{
    key: LOWER("nameDistance"),
    direction: SortDirection.DESC,
    nulls: NullsOrder.FIRST
  }]
})


const execQuery = <R>(query: Query<R>): R => {
  return {}
}

let testResult = execQuery(test)

testResult.my_alias.getDate()
testResult.my_aggregate_shit.toPrecision(3)
testResult.my_aggregate_shit.toFixed()

let aggregateResult = execQuery(innerQuery)
aggregateResult.average.toPrecision(3)
