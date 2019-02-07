import { HMAC } from "../../abstract/HMAC"
import { createHmac } from "crypto"

/**
 * The SHA1HMAC provides a HMAC implementation using SHA1 based on Node's
 * OpenSSL.
 *
 * This implementation relies on the node crypto implementation and may vary based
 * on the build flags of the underlying runtime.
 */
export class SHA1HMAC extends HMAC {
  public async calculate(input: Buffer): Promise<Buffer> {
    let hmacBuilder = createHmac("sha1", this.secretKey)
    hmacBuilder.update(input)

    return hmacBuilder.digest()
  }
}
