import { compileSQLFilter } from "../../../src/query/drivers/sql/SQLFilterCompiler"
import { expect } from "chai"
import { Filter } from "../../../src/query"

interface PGTestModel {
    id: number
    uuid?: string
    isActivated?: boolean
    isDisabled: boolean
    createdAt: Date
    creatorId: number
    removedAt: Date | null
}

describe("PGQueryCompiler", () => {
    const expectQueryOutcome = (
        query: Filter<PGTestModel>,
        expectedQuerystring: string,
        expectedParameters: Array<any>
    ) => {
        let result = compileSQLFilter(query)
        expect(result[0]).to.equal(expectedQuerystring)
        expect(result[1]).to.deep.equal(expectedParameters)
    }

    describe("Simple Queries", () => {
        it("should create a valid equals query", () => {
            expectQueryOutcome(
                {
                    id: 15,
                },
                "?? = ?",
                ["id", 15]
            )
        })

        it("should create a valid IN query", () => {
            expectQueryOutcome(
                {
                    id: {
                        $in: [15, 16, 17],
                    },
                },
                "?? IN ?",
                ["id", [15, 16, 17]]
            )
        })

        it("should create a always false condition for empty IN queries", () => {
            expectQueryOutcome(
                {
                    id: {
                        $in: [],
                    },
                },
                "TRUE = FALSE",
                []
            )
        })

        it("should create a valid NOT IN query", () => {
            expectQueryOutcome(
                {
                    id: {
                        $nin: [15, 16, 17],
                    },
                },
                "?? NOT IN ?",
                ["id", [15, 16, 17]]
            )
        })

        it("should create a valid not equal query", () => {
            expectQueryOutcome(
                {
                    uuid: {
                        $neq: "test",
                    },
                },
                "?? != ?",
                ["uuid", "test"]
            )
        })

        it("should create a valid greater than query", () => {
            expectQueryOutcome(
                {
                    creatorId: {
                        $gt: 5,
                    },
                },
                "?? > ?",
                ["creatorId", 5]
            )
        })

        it("should create a valid greater than or equal query", () => {
            expectQueryOutcome(
                {
                    creatorId: {
                        $gte: 12,
                    },
                },
                "?? >= ?",
                ["creatorId", 12]
            )
        })

        it("should create a valid less than query", () => {
            expectQueryOutcome(
                {
                    creatorId: {
                        $lt: 12,
                    },
                },
                "?? < ?",
                ["creatorId", 12]
            )
        })

        it("should create a valid less than or equal query", () => {
            expectQueryOutcome(
                {
                    creatorId: {
                        $lte: 12,
                    },
                },
                "?? <= ?",
                ["creatorId", 12]
            )
        })

        it("should create an always true condition for NOT IN an empty set", () => {
            expectQueryOutcome(
                {
                    creatorId: {
                        $nin: [],
                    },
                },
                "TRUE = TRUE",
                []
            )
        })

        it("should correctly handle a NULL equality", () => {
            expectQueryOutcome(
                {
                    removedAt: null,
                },
                "?? IS NULL",
                ["removedAt"]
            )
        })

        it("should correctly handle a NOT NULL equality", () => {
            expectQueryOutcome(
                {
                    removedAt: {
                        $neq: null,
                    },
                },
                "?? IS NOT NULL",
                ["removedAt"]
            )
        })
    })

    describe("OR Queries", () => {
        it("should correctly build a valid OR equality", () => {
            expectQueryOutcome(
                {
                    $or: [
                        {
                            removedAt: {
                                $neq: null,
                            },
                        },
                        {
                            uuid: "test",
                        },
                    ],
                },
                "(?? IS NOT NULL) OR (?? = ?)",
                ["removedAt", "uuid", "test"]
            )
        })
    })

    describe("AND Queries", () => {
        it("should correctly build a valid AND equality", () => {
            expectQueryOutcome(
                {
                    $and: [
                        {
                            removedAt: {
                                $neq: null,
                            },
                        },
                        {
                            uuid: "test",
                        },
                    ],
                },
                "(?? IS NOT NULL) AND (?? = ?)",
                ["removedAt", "uuid", "test"]
            )
        })
    })

    describe("Nested Queries", () => {
        it("should default to creating an AND statement for multiple root queries", () => {
            expectQueryOutcome(
                {
                    uuid: "test",
                    removedAt: {
                        $neq: null,
                    },
                },
                "(?? = ?) AND (?? IS NOT NULL)",
                ["uuid", "test", "removedAt"]
            )
        })

        it("should support the creation of deeply nested queries", () => {
            expectQueryOutcome(
                {
                    uuid: "test",
                    $or: [
                        {
                            $or: [
                                {
                                    removedAt: {
                                        $neq: null,
                                    },
                                },
                                {
                                    isDisabled: true,
                                },
                            ],
                        },
                        {
                            $and: [
                                {
                                    createdAt: {
                                        $gte: new Date(2000, 1, 1),
                                    },
                                },
                                {
                                    creatorId: {
                                        $lt: 15,
                                    },
                                },
                            ],
                        },
                    ],
                },
                "(((?? IS NOT NULL) OR (?? = ?)) OR ((?? >= ?) AND (?? < ?))) AND (?? = ?)",
                [
                    "removedAt",
                    "isDisabled",
                    true,
                    "createdAt",
                    new Date(2000, 1, 1),
                    "creatorId",
                    15,
                    "uuid",
                    "test",
                ]
            )
        })
    })
})
