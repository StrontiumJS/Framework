/**
 * The Hasher takes data and converts it to a irreversible signature. Depending on the implementing
 * class the speed, integrity and uniqueness of the Hash generated will vary based on the underlying
 * algorithm.
 */
export abstract class Hasher {
    /**
     * Generate a Hash of the provided Buffer and return a Base64 string of the digest
     *
     * @param {Buffer} data
     * @returns {string}
     */
    abstract hash(data: Buffer): string
}
