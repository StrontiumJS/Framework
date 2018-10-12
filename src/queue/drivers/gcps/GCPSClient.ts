import Axios from "axios"
import { AsymmetricJWTSigner, RSASHA256Signer } from "../../../cryptography"

export interface GCPSMessage {
    data: string
    attributes: {
        [key: string]: string
    }
}

export class GCPSClient {
    private signer: AsymmetricJWTSigner

    constructor(
        private serviceAccountEmail: string,
        private keyId: string,
        private privateKey: string
    ) {
        this.signer = new AsymmetricJWTSigner(
            new RSASHA256Signer(
                // Public key is empty as this will never be used to validate a token
                new Buffer(""),
                new Buffer(privateKey)
            ),
            "RS256",
            keyId
        )
    }

    async signRequest(
        audience: "google.pubsub.v1.Publisher" | "google.pubsub.v1.Subscriber"
    ): Promise<string> {
        let currentUnixTimestamp = Math.round(new Date().getTime() / 1000)

        return this.signer.sign({
            iss: this.serviceAccountEmail,
            sub: this.serviceAccountEmail,
            aud: audience,
            iat: currentUnixTimestamp,
            exp: currentUnixTimestamp + 3600,
        })
    }

    async publish(topic: string, message: GCPSMessage): Promise<void> {
        await Axios.post(
            `https://pubsub.googleapis.com/v1/${topic}:publish`,
            {
                messages: [message],
            },
            {
                headers: {
                    Authorization: `Bearer ${await this.signRequest(
                        "google.pubsub.v1.Publisher"
                    )}`,
                },
            }
        )
    }
}
