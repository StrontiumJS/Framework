export interface SQLStore {
    query<R>(queryString: string, parameters: Array<any>): Promise<Array<R>>
}
