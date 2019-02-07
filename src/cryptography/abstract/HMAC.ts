import { Digest } from "./Digest";
/**
 * A HMAC ( commonly referred to as a Hash ) (hash-based message authentication
 * code) is a type of message authentication code (MAC) that uses a
 * cryptographic hash function and a secret key. It may be used to verify data
 * integrity and authentication of a message.
 *
 * Strontium assumes that HMAC functions will run on input that is entirely
 * in memory. The interface does not currently support calculations against a
 * stream.
 *
 * The exact nature or security properties of a given HMAC implementation
 * will vary based on the implementing class.
 */
export abstract class HMAC extends Digest {
  /**
   * Create a new HMAC Encrypter.
   *
   * @param secretKey - The shared secret to use for encryption.
   */
  constructor(protected secretKey: Buffer) {
    super()
  }
}
