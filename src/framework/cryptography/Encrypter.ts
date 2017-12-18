/**
 * The Encrypter is responsible for symmetrically encrypting data so that it can be decrypted later.
 */
export abstract class Encrypter {
    /**
     * Encrypt the provided data and return the string representation of the output in Base64.
     * Depending on the symmetrical algorithm used by the underlying implementation and it's
     * security properties the exact nature of the response string may vary.
     *
     * @param {Buffer} data
     * @returns {string}
     */
    abstract encrypt(data: Buffer): string

    /**
     * Decrypt the provided data and return the binary data contained within the ciphertext.
     *
     * @param {string} data
     * @returns {string}
     */
    abstract decrypt(data: string): Buffer
}
