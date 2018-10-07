import { StrontiumError } from "./StrontiumError"

export class ValidationError extends StrontiumError {
    constructor(
        public constraintName: string,
        public systemMessage: string,
        public friendlyMessage: string = systemMessage
    ) {
        super()
    }
}
