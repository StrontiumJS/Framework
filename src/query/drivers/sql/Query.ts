import {
  DataSource,
  DataSourceOutput, NullsOrder,
  Query,
  QuerySelectedOutput,
  QuerySelector,
  SortDirection, SQLTransform
} from "../../abstract/Query";
import { SQL } from "./SQLMethods";
import { UUID } from "../../../utils/types";

import { Filter } from "../..";

export const createQuery = <P extends DataSource<any>, S extends QuerySelector<DataSourceOutput<P>>>(queryParameters: {
  selector: S
  from: P
  where?: Filter<DataSourceOutput<P>>
  groupBy?: S
  having?: Filter<QuerySelectedOutput<DataSourceOutput<P>, S>>
  orderBy?: Array<{
    key: S
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

let test = createQuery((sql) => ({
  selector: {
    "my_random_shit": "thing",
    "test_shit": sql.LOWER("wrong")
  },
  from: SQL.Table<{test: UUID, thing: Date}>("test"),
}))

const execQuery = <R>(query: Query<R>): R => {
  return {}
}

let testResult = execQuery(test)

testResult.thing.getFullYear()
testResult.test.big()
testResult.my_random_shit.bold()
