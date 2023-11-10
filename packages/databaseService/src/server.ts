import * as http from "http";
import { validateMethod } from "./utils";
import { Router } from "./router/router";
import { AbstractHttpServer } from "@estates/utils";

export class DbServer extends AbstractHttpServer {
    private router: Router;

    constructor(port: number = 13000, serviceName: string ) {
        super(port, serviceName);
        this.router = new Router();
    }

    handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");

        const validatedMethod = validateMethod(request.method);
        if (validatedMethod.code !== 200) {
            response.writeHead(validatedMethod.code);
            response.end(validatedMethod.message);
            return;
        }
        const routedResponse = this.router.routeRequest(request);
        if (!routedResponse) {
            response.writeHead(500);
            response.end("Internal server error");
            return;
        }
        response.writeHead(routedResponse.code);
        response.end(routedResponse.message);
    }
}
