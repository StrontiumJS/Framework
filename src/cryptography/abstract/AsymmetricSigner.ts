/**
 * An AsymmetricSigner represents a category of cryptographic algorithm that is able
 * to sign information using a secret referred to as a "Private Key".
 *
 * The authenticity of this signature can then be verified by anyone who possess the "Public Key"
 * which is generally safe to distribute.
 *
 * This allows for a small number of secure nodes to sign information which can then be generally
 * verified as correct by a large fleet of less secure entities.
 */
export abstract class AsymmetricSigner {
    /**
     * Create a new Asymmetric Signer.
     *
     * @param publicKey - The Public Key used to verify tokens
     * @param privateKey - The Private Key used to sign tokens
     */
    constructor(protected publicKey: Buffer, protected privateKey?: Buffer) {}

    /**
     * Sign the provided plaintext using the private key.
     *
     * N.B This method will throw an error if the private key has not been provided to the constructor.
     *
     * @param plaintext {Buffer} - Plaintext to undergo signing
     */
    public abstract sign(plaintext: Buffer): Promise<Buffer>

    /**
     * Verify that a signature is valid for a provided plaintext using the Public Key provided.
     *
     * @param plaintext {Buffer} - Plaintext from which the signature claims to originate
     * @param signature {Buffer} - The signature which claims to verify the authenticity of the plaintext
     */
    public abstract verify(
        plaintext: Buffer,
        signature: Buffer
    ): Promise<Buffer>
}
