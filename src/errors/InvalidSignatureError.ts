import { StrontiumError } from "./StrontiumError"

/**
 * An InvalidSignatureError is thrown when a Cryptographic signature does not match.
 */
export class InvalidSignatureError extends StrontiumError {
  constructor() {
    super(
      `The signature provided was not valid.`
    )
  }
}
