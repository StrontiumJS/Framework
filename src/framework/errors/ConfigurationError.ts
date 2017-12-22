import { StrontiumError } from "./StrontiumError"

/**
 * ConfigurationError represents an error in a value provided by a user of the Framework.
 *
 * More information about how to fix the problem should be included in the error message.
 */
export class ConfigurationError extends StrontiumError {
    constructor(m: string) {
        super(m)

        Object.setPrototypeOf(this, ConfigurationError.prototype)
    }
}
