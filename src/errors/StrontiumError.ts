export abstract class StrontiumError {
    public stack?: string

    constructor(public message?: string) {
        let error = new Error()

        this.stack = error.stack
    }
}
