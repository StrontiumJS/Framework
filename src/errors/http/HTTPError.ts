import { StrontiumError } from "../StrontiumError"

export abstract class HTTPError extends StrontiumError {
    constructor(
        public statusCode: number,
        private externalMessage: string,
        private internalMessage?: string
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
