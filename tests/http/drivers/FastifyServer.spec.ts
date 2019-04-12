import { expect } from "chai"
import { FastifyServer, RouterMap } from "../../../src/http"

describe("FastifyServer", () => {
    describe("Route Preprocessor", () => {
        it("should not affect normal route assignments", () => {
            let simpleRoutes: RouterMap = [
                {
                    endpointController: {} as any, // Irrelevant to this test
                    metadata: {
                        hello: "world!",
                    },
                    route: "/v1/test",
                    method: "GET",
                },
            ]

            let processedRoutes = FastifyServer.preProcessRoutes(simpleRoutes)

            expect(processedRoutes).to.deep.eq(simpleRoutes)
        })

        it("should rewrite enum parametrized routes to multiple fixed routes with metadata fields", () => {
            let complexRoutes: RouterMap = [
                {
                    endpointController: {} as any, // Irrelevant to this test
                    metadata: {
                        hello: "world!",
                    },
                    route:
                        "/v1/test/{enum_parameter|test,enum,values}/more-testing",
                    method: "GET",
                },
            ]

            let processedRoutes = FastifyServer.preProcessRoutes(complexRoutes)

            expect(processedRoutes).to.deep.eq([
                {
                    endpointController: {} as any,
                    metadata: {
                        hello: "world!",
                        enum_parameter: "test",
                    },
                    route: "/v1/test/test/more-testing",
                    method: "GET",
                },
                {
                    endpointController: {} as any,
                    metadata: {
                        hello: "world!",
                        enum_parameter: "enum",
                    },
                    route: "/v1/test/enum/more-testing",
                    method: "GET",
                },
                {
                    endpointController: {} as any,
                    metadata: {
                        hello: "world!",
                        enum_parameter: "values",
                    },
                    route: "/v1/test/values/more-testing",
                    method: "GET",
                },
            ])
        })

        it("should handle rewriting nested enum parameters", () => {
            let complexRoutes: RouterMap = [
                {
                    endpointController: {} as any, // Irrelevant to this test
                    route:
                        "/v1/test/{enum_parameter_1|a,b}/more-testing/:normal_param/{enum_parameter_2|x,y}",
                    method: "GET",
                },
            ]

            let processedRoutes = FastifyServer.preProcessRoutes(complexRoutes)

            expect(processedRoutes).to.deep.eq([
                {
                    endpointController: {} as any,
                    metadata: {
                        enum_parameter_1: "a",
                        enum_parameter_2: "x",
                    },
                    route: "/v1/test/a/more-testing/:normal_param/x",
                    method: "GET",
                },
                {
                    endpointController: {} as any,
                    metadata: {
                        enum_parameter_1: "a",
                        enum_parameter_2: "y",
                    },
                    route: "/v1/test/a/more-testing/:normal_param/y",
                    method: "GET",
                },
                {
                    endpointController: {} as any,
                    metadata: {
                        enum_parameter_1: "b",
                        enum_parameter_2: "x",
                    },
                    route: "/v1/test/b/more-testing/:normal_param/x",
                    method: "GET",
                },
                {
                    endpointController: {} as any,
                    metadata: {
                        enum_parameter_1: "b",
                        enum_parameter_2: "y",
                    },
                    route: "/v1/test/b/more-testing/:normal_param/y",
                    method: "GET",
                },
            ])
        })
    })
})
