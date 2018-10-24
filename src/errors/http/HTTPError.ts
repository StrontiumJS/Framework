import { StrontiumError } from "../StrontiumError"

export abstract class HTTPError extends StrontiumError {
    constructor(
        public statusCode: number,
        public externalMessage: string,
        public internalMessage?: string
    ) {
        super(internalMessage)

        Object.setPrototypeOf(this, HTTPError.prototype)
    }

    toResponseBody(): { statusCode: number; errorMessage: string } {
        return {
            statusCode: this.statusCode,
            errorMessage: this.externalMessage,
        }
    }

    public static isHTTPError(e: any): e is HTTPError {
        return (
            e !== undefined &&
            typeof e.statusCode === "number" &&
            typeof e.toResponseBody === "function"
        )
    }
}
