import * as http from "http";
import { Router } from "./router/router";
import { AbstractHttpServer } from "@estates/utils";

export class ListingsServer extends AbstractHttpServer {
    private router: Router;

    constructor(port: number = 11000, serviceName: string ) {
        super(port, serviceName);
        this.router = new Router();
    }

    handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        this.router.handleRequest(request,response);
    }
}
