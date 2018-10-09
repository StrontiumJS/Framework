import { HTTPError } from "./http/HTTPError"

export class ValidationError extends HTTPError {
    constructor(
        public constraintName: string,
        internalMessage: string,
        externalMessage: string = internalMessage,
        public fieldPath?: string
    ) {
        super(400, internalMessage, externalMessage)
    }

    public toResponseBody(): {
        statusCode: number
        errorMessage: string
        path?: string
    } {
        return {
            statusCode: this.statusCode,
            errorMessage: this.externalMessage,
            path: this.fieldPath,
        }
    }
}
