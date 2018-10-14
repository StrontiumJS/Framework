/**
 * A JWTSigner is used to create, verify and unwrap JWT tokens.
 *
 * A JWT - JSON Web Token - is a format for representing a claim alongside the data
 * necessary to authenticate the origin of the claim. In recent years they
 * have found favour as a mechanism for authentication.
 *
 * The Strontium library relies heavily on JWA - the open source library created
 * to provide Cryptographic primitives for JWT. Some developers may ask why we
 * decided to reimplement the JWTSigner class internally in the framework instead
 * of using popular open source JWT libraries. This is due to our wish for the internal
 * signing framework to be extensible.
 *
 * For example at Fundstack, where Strontium is developed, all of our cryptographic
 * key management is run inside of Google Cloud KMS backed by a HSM, largely for
 * compliance reasons. We needed to be able to have our JWT tokens signed by
 * this secure oracle which using the open source libraries available would not have supported.
 *
 * If an end user wishes to use a trusted open source library they can simply build a version of this
 * class which uses it accordingly.
 */
export abstract class JWTSigner {
    /**
     * Sign the provided claim using the private key. The claim will be manipulated into JSON and signed.
     *
     * @param plaintext {Buffer} - Plaintext to undergo signing
     * @return The signed JWT token representing the claim
     */
    public abstract sign(claim: any): Promise<string>

    /**
     * Verify that the JWT is valid for it's claim.
     *
     * Returns the claim if verified or throws an error if the claim cannot be authenticated.
     *
     * @param token - The JWT Token
     * @return The verified claim of the Token
     */
    public abstract verify(token: string): Promise<unknown>
}
