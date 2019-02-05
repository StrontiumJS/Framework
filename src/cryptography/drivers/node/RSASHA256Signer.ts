import { AsymmetricSigner } from "../../abstract/AsymmetricSigner"
import { InvalidSignatureError } from "../../../errors/InvalidSignatureError"

// Typescript Types not available for JWT - Proceed with caution
// @ts-ignore
import * as JWA from "jwa"

const RS256 = JWA("RS256")

export class RSASHA256Signer extends AsymmetricSigner {
    public async sign(plaintext: Buffer): Promise<Buffer> {
        return RS256.sign(plaintext, this.privateKey)
    }

    public async verify(plaintext: Buffer, signature: Buffer): Promise<Buffer> {
        let isValid = await RS256.verify(
            plaintext,
            signature.toString(),
            this.publicKey
        )

        if (!isValid) {
            throw new InvalidSignatureError()
        }

        // Spawn an empty buffer to fulfill the return type
        return Buffer.from([])
    }
}
