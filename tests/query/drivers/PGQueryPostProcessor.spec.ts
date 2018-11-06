import { pgQueryPostProcessor } from "../../../src/query/drivers/pg/PGQueryPostProcessor"
import { compileSQLFilter } from "../../../src/query/drivers/sql/SQLFilterCompiler"
import { expect } from "chai"

interface PGTestModel {
    id: number
    uuid?: string
    isActivated?: boolean
    isDisabled: boolean
    createdAt: Date
    creatorId: number
    removedAt: Date | null
}

describe("PGQueryPostProcessor", () => {
    const expectQueryOutcome = (
        query: string,
        parameters: Array<any>,
        expectedQuerystring: string,
        expectedParameters: Array<any>
    ) => {
        let result = pgQueryPostProcessor(query, parameters)
        expect(result[0]).to.equal(expectedQuerystring)
        expect(result[1]).to.deep.equal(expectedParameters)
    }

    describe("Simple Queries", () => {
        it("Should not modify simple queries", () => {
            expectQueryOutcome(
                `SELECT * FROM test`,
                [],
                "SELECT * FROM test",
                []
            )
        })
    })

    describe("Valid Postgres Queries", () => {
        it("Should not modify a valid Postgres Query", () => {
            expectQueryOutcome(
                `SELECT a, b FROM test WHERE a = $1`,
                [123],
                "SELECT a, b FROM test WHERE a = $1",
                [123]
            )
        })

        it("Should recalculate parameters and correctly order them", () => {
            expectQueryOutcome(
                `SELECT a, b FROM test WHERE a = $2`,
                [123],
                "SELECT a, b FROM test WHERE a = $1",
                [123]
            )
        })
    })

    describe("Valid MySQL Queries", () => {
        it("Should convert MySQL parametized queries into PostgreSQL", () => {
            expectQueryOutcome(
                `SELECT ??, ?? FROM test WHERE ?? = ?`,
                ["a", "b", "a", 123],
                "SELECT a, b FROM test WHERE a = $1",
                [123]
            )
        })

        it("Should support complex MySQL parametized queries into PostgreSQL", () => {
            expectQueryOutcome(
                `SELECT ??, ?? FROM test WHERE ?? = ? AND ? = ?? AND ( ?? IN ? OR ?? IS NOT NULL)   `,
                [
                    "a",
                    "b",
                    "a",
                    123,
                    ["test", "my", "thing"],
                    "b",
                    "things",
                    [1, 2, 3],
                    "finalThing",
                ],
                "SELECT a, b FROM test WHERE a = $1 AND $2 = b AND ( things IN $3 OR finalThing IS NOT NULL)   ",
                [123, ["test", "my", "thing"], [1, 2, 3]]
            )
        })
    })

    describe("Complex hybrid queries", () => {
        it("Should handle badly written nested queries with compiled filter output", () => {
            let [filterQuery, filterParameters] = compileSQLFilter({
                $or: [
                    {
                        test: "thing",
                    },
                    {
                        $and: [
                            {
                                otherThing: {
                                    $gt: 123,
                                },
                                moreThings: "test",
                            },
                            {
                                finalThing: {
                                    $in: ["final", "testing"],
                                },
                            },
                        ],
                    },
                ],
                rabbit: "foot",
            })

            let finalQuery = `SELECT ??, ??, ??, ?? FROM myTable WHERE ${filterQuery} LIMIT ?`

            expectQueryOutcome(
                finalQuery,
                ["a", "b", "c", "d", ...filterParameters, 250],
                "SELECT a, b, c, d FROM myTable WHERE ((test = $1) OR (((otherThing > $2) AND (moreThings = $3)) AND (finalThing IN ($4, $5)))) AND (rabbit = $6) LIMIT $7",
                ["thing", 123, "test", "final", "testing", "foot", 250]
            )
        })
    })
})
