import { Digest } from "../../abstract"
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
        // Create a new Hash Builder
        const hashBuilder = createHash("sha256")

        // Pass the input data to it
        hashBuilder.update(input)

        // Return the message digest
        return hashBuilder.digest()
    }
}
