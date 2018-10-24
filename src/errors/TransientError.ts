import { StrontiumError } from "./StrontiumError"

export class TransientError extends StrontiumError {
    constructor(message?: string) {
        super(message)

        Object.setPrototypeOf(this, TransientError.prototype)
    }
}
