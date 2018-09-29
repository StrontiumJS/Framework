/**
 * A MessageAuthenticationCode ( often called a tag, MAC or a HMAC ) is a fingerprint
 * used to confirm the origin and authenticity of a message and it's origin.
 *
 * Often confused with Digest Hashes - HMACs ( Hash based MACs ) differ significantly
 * from Digest hashes in that they require a secret key.
 *
 * Depending on the underlying implementation used the MAC class may provide stronger
 * or weaker guarantees of certain properties.
 */
export abstract class MessageAuthenticationCode {
    constructor(protected secretKey: Buffer) {}

    /**
     * Calculate and return the MAC of a given input using the secretKey provided
     * to the constructor.
     *
     * @param input {Buffer} The input to be MAC-ed
     */
    public abstract calculate(input: Buffer): string
}
