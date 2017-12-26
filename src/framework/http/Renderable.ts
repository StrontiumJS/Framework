/**
 * A Renderable represents an Entity which can be
 */
export abstract class Renderable {
    /**
     * Render should return the value that will be serialized for response to the client.
     *
     * It is used as an intermediary to take objects such as models from the Datastore and return the view of them
     * that you wish to present to the end user. One example might be stripping the password hash field from a user
     * model.
     *
     * @returns {any}
     */
    abstract render(): any
}
