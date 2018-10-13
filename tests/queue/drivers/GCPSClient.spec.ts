import { expect } from "chai"
import { GCPSClient } from "../../../src/queue"

describe("GCPSClient", () => {
    const client = new GCPSClient(
        process.env.GCPS_SERVICE_ACCOUNT_EMAIL!,
        process.env.GCPS_SERVICE_ACCOUNT_KEY_ID!,
        process.env.GCPS_SERVICE_ACCOUNT_PRIVATE_KEY!
    )

    beforeEach(async function() {
        this.timeout(5000)

        // Dump all existing messages
        let messages = await client.pullTasks(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            1000,
            true
        )

        if (messages.length > 0) {
            await client.acknowledge(
                "projects/strontium-tests/subscriptions/integrationTestSubscription",
                messages.map((m) => m.ackId)
            )
        }
    })

    it("Should publish a message and correctly reconstruct it", async () => {
        await client.publish(
            "projects/strontium-tests/topics/integrationTestTopic",
            {
                data: "MY-INTEGRATION-TEST",
                attributes: {},
            }
        )

        let messages = await client.pullTasks(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            1,
            true
        )

        expect(messages[0].message.data).to.equal("MY-INTEGRATION-TEST")

        await client.acknowledge(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            [messages[0].ackId]
        )
    })

    it("Acking a message should remove it from the queue", async () => {
        await client.publish(
            "projects/strontium-tests/topics/integrationTestTopic",
            {
                data: "MY-INTEGRATION-TEST",
                attributes: {},
            }
        )

        let messages = await client.pullTasks(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            1,
            true
        )

        expect(messages[0].message.data).to.equal("MY-INTEGRATION-TEST")

        // Ack the message if all goes to plan - this test suite can cause a build up of messages in the subscription if it
        // fails but for now that is just cleaned up manually meaning this is a little flaky.
        await client.acknowledge(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            [messages[0].ackId]
        )

        let secondMessages = await client.pullTasks(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            1,
            true
        )

        expect(secondMessages.length).to.equal(0)
    }).timeout(5000)

    it("Nacking a message should readd it to the queue", async () => {
        await client.publish(
            "projects/strontium-tests/topics/integrationTestTopic",
            {
                data: "NACKED-MESSAGE",
                attributes: {},
            }
        )

        let messages = await client.pullTasks(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            1,
            true
        )

        expect(messages[0].message.data).to.equal("NACKED-MESSAGE")

        // Ack the message if all goes to plan - this test suite can cause a build up of messages in the subscription if it
        // fails but for now that is just cleaned up manually meaning this is a little flaky.
        await client.modifyAckDeadline(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            [messages[0].ackId],
            0
        )

        let secondMessages = await client.pullTasks(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            1,
            true
        )

        expect(secondMessages[0].message.data).to.equal("NACKED-MESSAGE")

        await client.acknowledge(
            "projects/strontium-tests/subscriptions/integrationTestSubscription",
            [secondMessages[0].ackId]
        )
    }).timeout(5000)

    it("Should fetch a GCPS Subscription", async () => {

        let subscription = await client.getSubscriptionData("projects/strontium-tests/subscriptions/integrationTestSubscription")

        expect(subscription.pushConfig).to.deep.equal({})
        expect(subscription.ackDeadlineSeconds).to.equal(25)
    })
})
