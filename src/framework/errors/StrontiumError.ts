/**
 * StrontiumError is the base error class for the Strontium framework.
 *
 * It simply exposes a constant flag so the framework can detect it's own errors.
 */
export abstract class StrontiumError extends Error {
    public is_strontium: boolean = true
}
