import { EndpointController } from "../../../src/framework/http/EndpointController"
import { Renderable } from "../../../src/framework/http/Renderable"

export class TestController extends EndpointController<TestResponse | void> {
    public async extract(req: Express.Request): Promise<void> {
        return
    }

    public async validate(): Promise<void> {
        return
    }

    public async authorize(): Promise<boolean> {
        return true
    }

    public async handle(): Promise<TestResponse | void> {
        return
    }
}

export class TestResponse extends Renderable {
    private message: string

    constructor(message: string) {
        super()

        this.message = message
    }
    public async render(): Promise<any> {
        return {
            message: this.message,
        }
    }
}
