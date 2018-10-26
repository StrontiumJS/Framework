import { expect } from "chai"
import { ConstructorOf } from "../../src/utils/types"

export const expectToThrowCustomClass = (
    candidateFunction: Function,
    classContructor: ConstructorOf<any>
) => {
    try {
        candidateFunction()
        expect(false).to.equal(true)
    } catch (e) {
        expect(e).to.be.instanceOf(classContructor)
    }
}

export const expectToThrowCustomClassAsync = async (
    candidateFunction: Function,
    classContructor: ConstructorOf<any>
) => {
    try {
        await candidateFunction()
        expect(false).to.equal(true)
    } catch (e) {
        expect(e).to.be.instanceOf(classContructor)
    }
}
