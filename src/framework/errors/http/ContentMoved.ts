import { HTTPError } from "./HTTPError"

/**
 * A ContentMoved error means that the requested content has moved it's location.
 *
 * This error is often used to redirect a client to the new location of the resource.
 * Depending on the optional second parameter the code
 */
export class ContentMoved extends HTTPError {
    private location: string
    private permanent: boolean

    constructor(location: string, permanent: boolean = true) {
        super("Content Moved")

        Object.setPrototypeOf(this, ContentMoved.prototype)

        this.location = location
        this.permanent = permanent
    }

    render(): any {
        return {}
    }

    statusCode(): number {
        if ( this.permanent === true ) {
            return 301
        } else {
            return 302
        }
    }

    public headers(): { [p: string]: string } {
        return {
            Location: this.location
        }
    }
}
