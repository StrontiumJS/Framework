import { ValidationError } from "../../../errors/ValidationError"

export const isBoolean = (input?: unknown): boolean | undefined => {
  if (input === undefined) {
    return undefined
  }

  if (typeof input === "boolean") {
    return input
  }

  throw new ValidationError(
    "IS_BOOLEAN",
    "Value not a boolean",
    "This value must be a boolean."
  )
}
