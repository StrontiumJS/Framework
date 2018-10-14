import { expect } from "chai"
import { SHA256Digest } from "../../../../src"

describe("SHA256Digest", () => {
    /**
     * Verify that the implementation passes the NIST cryptographic test vectors.
     *
     * Source: https://csrc.nist.gov/csrc/media/projects/cryptographic-standards-and-guidelines/documents/examples/sha_all.pdf
     */
    describe("Cryptographic Test Vectors", () => {
        let hasher: SHA256Digest

        before(() => {
            hasher = new SHA256Digest()
        })

        const testHash = async (plaintext: string, digest: string) => {
            let result = await hasher.calculate(new Buffer(plaintext, "utf8"))

            expect(result.toString("hex")).to.equal(digest)
        }

        it('"abc", the bit string (0x)616263 of length 24 bits', async () => {
            await testHash(
                "abc",
                "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
            )
        })

        it('the empty string "", the bit string of length 0', async () => {
            await testHash(
                "",
                "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            )
        })

        it('"abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq" (length 448 bits)', async () => {
            await testHash(
                "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
                "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1"
            )
        })

        it('one million (1,000,000) repetitions of the character "a" (0x61).', async () => {
            let testString = ""
            for (let i = 0; i < 100000; i++) {
                testString += "aaaaaaaaaa"
            }

            await testHash(
                testString,
                "cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0"
            )
        })
    })
})
