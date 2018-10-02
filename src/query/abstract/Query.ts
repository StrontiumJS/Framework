export type ObjectQuery<T> = { [P in keyof T]?: FieldFilter<P, T> }

export type FieldFilter<P extends keyof T, T> =
    | {
          $in?: Array<T[P]>
          $nin?: Array<T[P]>
          $neq?: T[P] | null
          $gt?: T[P]
          $gte?: T[P]
          $lt?: T[P]
          $lte?: T[P]
      }
    | T[P]

export type Query<T> = {
    $and?: Array<Query<T>>
    $or?: Array<Query<T>>
} & ObjectQuery<T> &
    Object
