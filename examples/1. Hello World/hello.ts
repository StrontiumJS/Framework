import "reflect-metadata"

import { FastifyServer } from "../../src/http/drivers/FastifyServer"
import { ControllerInput, ControllerOutput, EndpointController } from "../../src/http"
import { injectable } from "inversify"
import { AggregateLogger, ConsoleLogger, LogLevel } from "../../src/logging"
import { Runtime } from "../../src/runtime"
import { isNull, isString } from "../../src/validation"

// Create a simple hello world controller
@injectable()
class HelloWorldController extends EndpointController {

  public inputValidator = {
    body: isNull,
    headers: {},
    query: {},
    params: {
      name: isString
    },
    meta: {}
  }

  public outputValidator = isString

  public async handle(input: ControllerInput<HelloWorldController>): Promise<ControllerOutput<HelloWorldController>> {
    return `Hello ${input.params.name || "World"}`
  }
}

// Create a simple process runtime with a console logger and a Fastify web server
let helloRuntime = new Runtime([
    new AggregateLogger([
      new ConsoleLogger(LogLevel.INFO)
    ]),
    new FastifyServer([{
      method: "GET",
      route: "/hello",
      endpointController: HelloWorldController
    }, {
      method: "GET",
      route: "/hello/:name",
      endpointController: HelloWorldController
    }])
])

// Start the server
helloRuntime.startup()