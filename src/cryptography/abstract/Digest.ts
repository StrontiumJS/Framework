/**
 * A Digest ( commonly referred to as a Hash ) is a function which takes an input
 * and maps it to a string which deterministically fingerprints the input.
 *
 * Strontium assumes that Digest functions will run on input that is entirely
 * in memory. The interface does not currently support calculations against a
 * stream.
 *
 * The exact nature or security properties of a given Digest implementation
 * will vary based on the implementing class.
 */
export abstract class Digest {
    /**
     * Calculate and return the digest of a given input.
     *
     * @param input {Buffer} The input to be hashed
     */
    public abstract hash(input: Buffer): string
}
