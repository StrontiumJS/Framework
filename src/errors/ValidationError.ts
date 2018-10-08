import { HTTPError } from "./http/HTTPError"

export class ValidationError extends HTTPError {
    constructor(
        public constraintName: string,
        public systemMessage: string,
        public friendlyMessage: string = systemMessage,
        public fieldPath?: string
    ) {
        super(400, friendlyMessage, systemMessage)
    }

    public toResponseBody(): {
        statusCode: number
        errorMessage: string
        path?: string
    } {
        return {
            statusCode: this.statusCode,
            errorMessage: this.friendlyMessage,
            path: this.fieldPath,
        }
    }
}
