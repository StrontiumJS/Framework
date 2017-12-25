import { Renderable } from "../../http/Renderable"
import { StrontiumError } from "../StrontiumError"

export abstract class HTTPError extends StrontiumError implements Renderable {
    public abstract render(): any

    public abstract status_code(): number
}
