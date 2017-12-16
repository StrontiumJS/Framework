/**
 * A Runtime encapsulates a mode of operation for the application. It encapsulates the necessary bootstrapping and
 * shutdown logic for the application to operate.
 */

export abstract class Runtime {
    public abstract async start(): Promise<void>

    public abstract async stop(): Promise<void>
}
