import { Digest } from "../../abstract/Digest"
import { createHash } from "crypto"

/**
 * The SHA256Digest provides a Digest implementation using SHA256 based on Node's
 * OpenSSL.
 *
 * This implementation relies on the node crypto implementation and may vary based
 * on the build flags of the underlying runtime.
 */
export class SHA256Digest extends Digest {
    public calculate(input: Buffer): Buffer {
        const hashBuilder = createHash("sha256")
        hashBuilder.update(input)

        return hashBuilder.digest()
    }
}
