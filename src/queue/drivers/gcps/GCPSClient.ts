import Axios from "axios"
import { AsymmetricJWTSigner, RSASHA256Signer } from "../../../cryptography"
import { isPlainObject } from "lodash"

export interface GCPSMessage {
    data: any
    attributes: {
        [key: string]: string
    }
}

export interface GCPSSubscription {
    name: string
    topic: string
    pushConfig: {
        pushEndpoint?: string
    }
    ackDeadlineSeconds: number
    retainAckedMessages: boolean
    messageRetentionDuration: string
}

export class GCPSClient {
    private signer: AsymmetricJWTSigner

    constructor(
        private serviceAccountEmail: string,
        private keyId: string,
        private privateKey: string
    ) {
        // Sanitize the private key
        let sanitizedPrivateKey = privateKey.replace(
            /\\n/g,
            `
`
        )

        this.signer = new AsymmetricJWTSigner(
            new RSASHA256Signer(
                // Public key is empty as this will never be used to validate a token
                new Buffer(""),
                new Buffer(sanitizedPrivateKey)
            ),
            "RS256",
            keyId
        )
    }

    public async signRequest(
        audience:
            | "https://pubsub.googleapis.com/google.pubsub.v1.Publisher"
            | "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"
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

    public async publish(topic: string, message: GCPSMessage): Promise<void> {
        await Axios.post(
            `https://pubsub.googleapis.com/v1/${topic}:publish`,
            {
                messages: [
                    {
                        attributes: message.attributes,
                        data: Buffer.from(
                            JSON.stringify(message.data)
                        ).toString("base64"),
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${await this.signRequest(
                        "https://pubsub.googleapis.com/google.pubsub.v1.Publisher"
                    )}`,
                },
            }
        )
    }

    public async getSubscriptionData(
        subscriptionName: string
    ): Promise<GCPSSubscription> {
        let subscriptionResp = await Axios.get(
            `https://pubsub.googleapis.com/v1/${subscriptionName}`,
            {
                headers: {
                    Authorization: `Bearer ${await this.signRequest(
                        "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"
                    )}`,
                },
            }
        )

        return subscriptionResp.data
    }

    public async pullTasks(
        subscriptionName: string,
        maxMessages: number = 10,
        returnImmediately: boolean = false
    ): Promise<
        Array<{
            ackId: string
            message: GCPSMessage
        }>
    > {
        let taskResp = await Axios.post(
            `https://pubsub.googleapis.com/v1/${subscriptionName}:pull`,
            {
                returnImmediately: returnImmediately,
                maxMessages: maxMessages,
            },
            {
                headers: {
                    Authorization: `Bearer ${await this.signRequest(
                        "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"
                    )}`,
                },
                // Set a 90 second timeout to take advantage of long polling
                timeout: 120 * 1000,
            }
        )

        return taskResp.data.receivedMessages
            ? taskResp.data.receivedMessages.map((m: any) => {
                  return {
                      ackId: m.ackId,
                      message: {
                          attributes: m.attributes,
                          data: JSON.parse(
                              Buffer.from(m.message.data, "base64").toString()
                          ),
                      },
                  }
              })
            : []
    }

    public async modifyAckDeadline(
        subscriptionName: string,
        ackIds: Array<string>,
        ackExtensionSeconds: number
    ): Promise<void> {
        await Axios.post(
            `https://pubsub.googleapis.com/v1/${subscriptionName}:modifyAckDeadline`,
            {
                ackIds: ackIds,
                ackDeadlineSeconds: ackExtensionSeconds,
            },
            {
                headers: {
                    Authorization: `Bearer ${await this.signRequest(
                        "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"
                    )}`,
                },
            }
        )
    }

    public async acknowledge(
        subscriptionName: string,
        ackIds: Array<string>
    ): Promise<void> {
        await Axios.post(
            `https://pubsub.googleapis.com/v1/${subscriptionName}:acknowledge`,
            {
                ackIds: ackIds,
            },
            {
                headers: {
                    Authorization: `Bearer ${await this.signRequest(
                        "https://pubsub.googleapis.com/google.pubsub.v1.Subscriber"
                    )}`,
                },
            }
        )
    }
}
