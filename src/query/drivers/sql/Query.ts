import { UUID } from "../../../utils/types";
import { DataSource, Query, QuerySelectedOutput, QuerySelector } from "../../abstract/Query";
import { SQL, SQLTable } from "./SQLMethods";

import { Filter } from "../..";

export const createQuery = <P extends SQLTable<any> | Query<any>, S extends QuerySelector<DataSource<P>>>(queryParameters: {
  selector: S
  from: P
  where?: Filter<DataSource<P>>
  groupBy?: S
  having?: S
  orderBy?: Array<{
    key: S
    direction: "ASC" | "DESC"
    nulls: "FIRST" | "LAST"
  }>
  limit?: number
  offset?: number
}): Query<QuerySelectedOutput<DataSource<P>, S>> => {
  return {}
}

let test = createQuery({
  selector: ["thing", "test"],
  from: SQL.Table<{test: UUID, thing: Date}>("test")
})

const execQuery = <R>(query: Query<R>): R => {
  return {}
}

let testResult = execQuery(test)

testResult.thing.getFullYear()
testResult.test.big()
