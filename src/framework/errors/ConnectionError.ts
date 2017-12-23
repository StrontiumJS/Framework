import { StrontiumError } from "./StrontiumError"

/**
 * A ConnectionError represents an attempt to perform an operation on a connection that has been closed or otherwise disconnected.
 */
export class ConnectionError extends StrontiumError {
    constructor(m: string) {
        super(m)

        Object.setPrototypeOf(this, ConnectionError.prototype)
    }
}
