export interface SQLTable<R> {
  name: string
  alias: string
  tableStructure?: R
}

export class SQL {
  public static Table<R>(name: string): SQLTable<R> {
    return {
      name: name,
      alias: name,
    }
  }
}
