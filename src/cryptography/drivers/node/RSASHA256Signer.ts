import { AsymmetricSigner } from "../../abstract/AsymmetricSigner"

// Typescript Types not available for JWT - Proceed with caution
// @ts-ignore
import * as JWA from "jwa"

const RS256 = JWA("RS256")

export class RSASHA256Signer extends AsymmetricSigner {
    public async sign(plaintext: Buffer): Promise<Buffer> {
        return RS256.sign(plaintext, this.privateKey)
    }

    public async verify(plaintext: Buffer, signature: Buffer): Promise<Buffer> {
        return RS256.verify(plaintext, signature, this.publicKey)
    }
}
