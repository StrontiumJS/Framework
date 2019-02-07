import { AsymmetricSigner } from "../../abstract/AsymmetricSigner"
import { InvalidSignatureError } from "../../../errors/InvalidSignatureError"

// Typescript Types not available for JWT - Proceed with caution
// @ts-ignore
import * as JWA from "jwa"

export class RSASHA256Signer extends AsymmetricSigner {
    private signer = JWA(this.algorithm)

    constructor(
        public publicKey: Buffer,
        public privateKey?: Buffer,
        private algorithm: "RS256" | "PS256" = "RS256"
    ) {
        super(publicKey, privateKey)
    }

    public async sign(plaintext: Buffer): Promise<Buffer> {
        return this.signer.sign(plaintext, this.privateKey)
    }

    public async verify(plaintext: Buffer, signature: Buffer): Promise<Buffer> {
        let isValid = await this.signer.verify(
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
