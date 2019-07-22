import { DataSource } from "../../abstract/Query"

export interface SQLTable<R> extends DataSource<R> {
  name: string
  alias: string
}

export class SQL {
  public static Table<R>(name: string): SQLTable<R> {
    return {
      name: name,
      alias: name,
    }
  }
}
