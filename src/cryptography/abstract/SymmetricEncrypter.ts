/**
 * A Symmetric Encrypter represents a black box that implements single shared secret
 * cryptographic algorithms for symmetric encryption.
 *
 * The underlying implementation of the Symmetric Encrypter will determine the
 * security properties of the Encrypter.
 *
 * Depending on the exact nature of the implementation it may also
 * support additional features such as Authentication (AAED).
 */
export abstract class SymmetricEncrypter {
    constructor(protected secretKey: Buffer) {}

    /**
     * Encrypt the provided Plaintext using the Symmetric Encryption algorithm
     * and return the Ciphertext.
     *
     * @param plaintext {Buffer} - Plaintext to undergo encryption
     */
    public abstract encrypt(plaintext: Buffer): Buffer

    /**
     * Decrypt encrypted Ciphertext to it's original Plaintext form.
     *
     * @param ciphertext {Buffer} - Ciphertext to undergo decryption
     */
    public abstract decrypt(ciphertext: Buffer): Buffer
}
