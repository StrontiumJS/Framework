import { expect } from "chai"
import { GCPSClient } from "../../../src/queue"

// const TOPIC_NAME = "projects/strontium-tests/topics/integrationTestTopic"
// const SUBSCRIPTION_NAME = "projects/strontium-tests/subscriptions/strontiumIntegrationTest"
const TOPIC_NAME =
    "projects/fundstack-david-development/subscriptions/federal-to-load-publisher"
const SUBSCRIPTION_NAME =
    "projects/fundstack-david-development/subscriptions/federal-to-load-receiver"

describe("GCPSClient", () => {
    const client = new GCPSClient(
        process.env.GCPS_SERVICE_ACCOUNT_EMAIL!,
        process.env.GCPS_SERVICE_ACCOUNT_KEY_ID!,
        process.env.GCPS_SERVICE_ACCOUNT_PRIVATE_KEY!
    )

    before(function() {
        // If the test suite is not running in CI then skip this suite - it's slow and requires credentials
        if (process.env.CI !== "true") {
            this.skip()
        }
    })

    beforeEach(async function() {
        this.timeout(5000)

        // Dump all existing messages
        let messages = await client.pullTasks(SUBSCRIPTION_NAME, 1000, true)

        if (messages.length > 0) {
            await client.acknowledge(
                SUBSCRIPTION_NAME,
                messages.map((m) => m.ackId)
            )
        }
    })

    it("Should publish a message and correctly reconstruct it", async () => {
        await client.publish(TOPIC_NAME, {
            data: "MY-INTEGRATION-TEST",
            attributes: {},
        })

        let messages = await client.pullTasks(SUBSCRIPTION_NAME, 1, true)

        expect(messages[0].message.data).to.equal("MY-INTEGRATION-TEST")

        await client.acknowledge(SUBSCRIPTION_NAME, [messages[0].ackId])
    }).timeout(5000)

    it("Should publish several messages and correctly reconstruct them", async () => {
        await client.publish(TOPIC_NAME, [
            {
                data: "MY-INTEGRATION-TEST",
                attributes: {},
            },
            {
                data: "MY-INTEGRATION-TEST2",
                attributes: {},
            },
        ])

        let messages = await client.pullTasks(SUBSCRIPTION_NAME, 1, true)

        expect(messages[0].message.data).to.equal("MY-INTEGRATION-TEST")
        expect(messages[1].message.data).to.equal("MY-INTEGRATION-TEST2")

        await client.acknowledge(SUBSCRIPTION_NAME, [messages[0].ackId])
        await client.acknowledge(SUBSCRIPTION_NAME, [messages[1].ackId])
    }).timeout(5000)

    it("Acking a message should remove it from the queue", async () => {
        await client.publish(TOPIC_NAME, {
            data: "MY-INTEGRATION-TEST",
            attributes: {},
        })

        let messages = await client.pullTasks(SUBSCRIPTION_NAME, 1, true)

        expect(messages[0].message.data).to.equal("MY-INTEGRATION-TEST")

        // Ack the message if all goes to plan - this test suite can cause a build up of messages in the subscription if it
        // fails but for now that is just cleaned up manually meaning this is a little flaky.
        await client.acknowledge(SUBSCRIPTION_NAME, [messages[0].ackId])

        let secondMessages = await client.pullTasks(SUBSCRIPTION_NAME, 1, true)

        expect(secondMessages.length).to.equal(0)
    }).timeout(5000)

    it("Nacking a message should readd it to the queue", async () => {
        await client.publish(TOPIC_NAME, {
            data: "NACKED-MESSAGE",
            attributes: {},
        })

        let messages = await client.pullTasks(SUBSCRIPTION_NAME, 1, true)

        expect(messages[0].message.data).to.equal("NACKED-MESSAGE")

        // Ack the message if all goes to plan - this test suite can cause a build up of messages in the subscription if it
        // fails but for now that is just cleaned up manually meaning this is a little flaky.
        await client.modifyAckDeadline(
            SUBSCRIPTION_NAME,
            [messages[0].ackId],
            0
        )

        let secondMessages = await client.pullTasks(SUBSCRIPTION_NAME, 1, true)

        expect(secondMessages[0].message.data).to.equal("NACKED-MESSAGE")

        await client.acknowledge(SUBSCRIPTION_NAME, [secondMessages[0].ackId])
    }).timeout(5000)

    it("Should fetch a GCPS Subscription", async () => {
        let subscription = await client.getSubscriptionData(SUBSCRIPTION_NAME)

        expect(subscription.pushConfig).to.deep.equal({})
        expect(subscription.ackDeadlineSeconds).to.equal(10)
    })
})
