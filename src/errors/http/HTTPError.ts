import { StrontiumError } from "../StrontiumError"

export abstract class HTTPError extends StrontiumError {
    constructor(
        public statusCode: number,
        public externalMessage: string,
        public internalMessage?: string
    ) {
        super(internalMessage)
    }

    toResponseBody(): { statusCode: number; errorMessage: string } {
        return {
            statusCode: this.statusCode,
            errorMessage: this.externalMessage,
        }
    }
}
