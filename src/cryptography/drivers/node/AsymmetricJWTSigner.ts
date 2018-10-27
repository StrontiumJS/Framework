import { AsymmetricSigner } from "../../abstract/AsymmetricSigner"
import { JWTSigner } from "../../abstract/JWTSigner"

// Types are dodgy on this library
// @ts-ignore
import { decode, encode, fromBase64 } from "base64url"

export class AsymmetricJWTSigner extends JWTSigner {
    constructor(
        private signer: AsymmetricSigner,
        private algorithmCode: string,
        private keyId?: string
    ) {
        super()
    }

    public async sign(claim: any): Promise<string> {
        // JSONify the claim
        let stringifiedClaim = JSON.stringify(claim)
        let encodedClaim = encode(stringifiedClaim)

        let stringifiedHeader = JSON.stringify({
            alg: this.algorithmCode,
            typ: "JWT",
            kid: this.keyId,
        })
        let encodedHeader = encode(stringifiedHeader)

        let signature = await this.signer.sign(
            new Buffer(`${encodedHeader}.${encodedClaim}`)
        )

        return `${encodedHeader}.${encodedClaim}.${fromBase64(
            signature.toString("base64")
        )}`
    }

    public async verify(token: string): Promise<unknown> {
        // Split the token into three parts
        let claimComponents = token.split(".")

        if (claimComponents.length !== 3) {
            throw new Error(
                "JWT supplied the incorrect number of components to verify."
            )
        }

        let claimHeader = claimComponents[0]
        let parsedClaimHeader = JSON.parse(decode(claimHeader))

        if (parsedClaimHeader.alg !== this.algorithmCode) {
            throw new Error(
                "JWT supplied a signing algorithm that is not supported by this validator."
            )
        }

        let claimBody = claimComponents[1]

        let decodedSignature = new Buffer(decode(claimComponents[2]))

        // Delegate validation of the signature to the signer
        await this.signer.verify(
            new Buffer(`${claimHeader}.${claimBody}`),
            decodedSignature
        )

        // If no error occurred then the token is valid. Parse the claim and return
        let parsedClaimBody = JSON.parse(decode(claimBody))
        return parsedClaimBody
    }
}
