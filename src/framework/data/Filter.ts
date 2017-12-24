/**
 * A Filter represents a collection of statements that provide criteria for selecting data from
 * a set.
 *
 * It is designed as an abstraction over a variety of different datastores query language.
 */
export type Filter<T> = Array<[keyof T, string, any] | "OR" | "AND">
