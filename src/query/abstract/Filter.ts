export type FilterObject<T> = { [P in keyof T]?: FieldFilter<P, T> }

export type FieldFilter<P extends keyof T, T> =
    | {
          $in?: Array<T[P]>
          $nin?: Array<T[P]>
          $eq?: T[P]
          // TODO: Review if the null type on $neq is necessary
          $neq?: T[P] | null
          $gt?: T[P]
          $gte?: T[P]
          $lt?: T[P]
          $lte?: T[P]
          $contains?: T[P]
          $arr_contains?: T[P] // Could be made conditional so it only appears where T[P] is an Array
      }
    | T[P]

export type Filter<T> = {
    $and?: Array<Filter<T>>
    $or?: Array<Filter<T>>
} & FilterObject<T>
