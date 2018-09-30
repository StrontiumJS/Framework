/**
 * A Process represents a long running logical process within the wider scope
 * of an application runtime.
 *
 * An example might be a Web Server or a Database Connection pool.
 *
 * Conceptually a Process has a startup procedure, a shutdown procedure and an
 * ongoing state.
 *
 * The lifetime expectations of a Process are as follows:
 * 1. It should not have any effect until started
 * 2. All effects should cease and be cleaned once shutdown is closed.
 * 3. The isHealthy check should only return true if the process is functioning nominally. Any abnormal behaviour or errors
 * should trigger an error.
 */
export abstract class Process {
    /**
     * Start the process.
     *
     * Implementing processes should take care to ensure that startup is roughly idempotent ( i.e subsequent calls will
     * not cause issues in an already started process ).
     *
     * Implementations should also ensure not to cause any side effects prior to Startup being called.
     */
    public abstract async startup(): Promise<void>

    /**
     * Stop the process.
     *
     * Implementing processes should use this hook to close all open connections, sockets and event loop items
     * ( intervals, timeouts, etc. ).
     *
     * Runtimes will expect that upon the completion of the Promise shutdown is complete to the level that node
     * will gracefully terminate ( the event loop is empty ).
     */
    public abstract async shutdown(): Promise<void>

    /**
     * Return the health status of the Process.
     *
     * If the process is unable to function as originally anticipated then it should return false.
     *
     * Runtime implementations will decide what to do in the case of health check failure but actions may include
     * attempting to restart the process using Shutdown and Startup sequentially or simply killing the entire runtime.
     */
    public abstract isHealthy(): boolean
}
