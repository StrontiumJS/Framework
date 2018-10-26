import {
    expectToThrowCustomClass,
    expectToThrowCustomClassAsync,
} from "../../../helpers/ExpectToThrowCustomClass"
import { expect } from "chai"
import { either } from "../../../../src/validation/drivers/helpers/either"
import { isArray } from "../../../../src/validation/drivers/validators/isArray"
import {
    ValidationError,
    isBoolean,
    isNumber,
    isObject,
    isString,
    isUndefined,
} from "../../../../src"

describe("isArray", () => {
    it("should return the validated array if all values are valid", async () => {
        let testValidator = isArray(
            isObject({
                test: isString,
                otherTest: isNumber,
                optionalTest: either(isUndefined, isBoolean),
            })
        )

        expect(
            await testValidator([
                {
                    test: "test",
                    otherTest: 15,
                },
                {
                    test: "more test",
                    otherTest: 15,
                    optionalTest: false,
                },
            ])
        ).to.deep.equal([
            {
                test: "test",
                otherTest: 15,
            },
            {
                test: "more test",
                otherTest: 15,
                optionalTest: false,
            },
        ])

        expect(await testValidator([])).to.deep.equal([])
    })

    it("should return a validation error if input is not boolean", async () => {
        let testValidator = isArray(
            isObject({
                test: isString,
                otherTest: isNumber,
                optionalTest: either(isUndefined, isBoolean),
            })
        )

        await expectToThrowCustomClassAsync(
            async () => await testValidator({}),
            ValidationError
        )
        await expectToThrowCustomClassAsync(
            async () => await testValidator("false"),
            ValidationError
        )
        await expectToThrowCustomClassAsync(
            async () => await testValidator("true"),
            ValidationError
        )
        await expectToThrowCustomClassAsync(
            async () => await testValidator(false),
            ValidationError
        )
        await expectToThrowCustomClassAsync(
            async () => await testValidator([{}]),
            ValidationError
        )
        await expectToThrowCustomClassAsync(
            async () =>
                await testValidator([
                    {
                        test: "test",
                        otherTest: 15,
                    },
                    {
                        test: "test",
                        otherTest: 15,
                        optionalTest: "wrong",
                    },
                ]),
            ValidationError
        )
    })
})
