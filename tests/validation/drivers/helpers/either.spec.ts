import { expect } from "chai"
import {
    either,
    isUndefined,
    isObject,
    isString,
    isBoolean,
    isISOAlpha2CountryCode,
    isNumber,
} from "../../../../src"

describe("either", () => {
    it("should return the first validator that passes", async () => {
        let testVariable: number | boolean = false
        let testValidator = either(isNumber, isBoolean, isISOAlpha2CountryCode)

        let testOutput: number | boolean | string = await testValidator(
            testVariable
        )
        expect(testOutput).to.equal(false)

        testVariable = 26
        testOutput = await testValidator(testVariable)
        expect(testOutput).to.equal(26)
    })

    it("should return the path if the isObject validator failed", async () => {
        const testValidator = isObject({
            a: either(
                isObject({
                    b: isObject({
                        c: isObject({
                            d: either(isUndefined, isNumber),
                        }),
                    }),
                }),
                isObject({
                    b: either(
                        isUndefined,
                        isObject({
                            c: either(
                                isUndefined,
                                isObject({
                                    d: either(isBoolean, isNumber),
                                })
                            ),
                        })
                    ),
                })
            ),
        })

        try {
            let thing = await testValidator({ a: { b: { c: { d: "asdf" } } } })
            expect(false).to.equal(true, "Should have thrown an error")
        } catch (e) {
            expect(e.fieldPath).to.equal("a")
            let firstConstraint = `IS_OBJECT(EITHER(IS_UNDEFINED,IS_NUMBER))`
            let secondConstraint = `IS_OBJECT(EITHER(IS_UNDEFINED,IS_OBJECT(EITHER(IS_UNDEFINED,IS_OBJECT(EITHER(IS_BOOLEAN,IS_NUMBER))))))`

            expect(e.constraintName).to.equal(
                `EITHER(${firstConstraint},${secondConstraint})`
            )
            expect(e.message.match(/Path:/g).length).to.equal(4)
            expect(e.message.match(/Path: 'b'/g).length).to.equal(1)
            expect(e.message.match(/Path: 'c'/g).length).to.equal(1)
            expect(e.message.match(/Path: 'd'/g).length).to.equal(1)
            expect(e.message.match(/Path: 'b\.c\.d'/g).length).to.equal(1)
        }
    })
})
