import * as http from "http";
import { Router } from "./router/router";
import { AbstractHttpServer } from "@estates/utils";
import { DatabaseClient } from "@estates/database-client";

export class ListingsServer extends AbstractHttpServer {
    private router: Router;
    private databaseClient: DatabaseClient;

    constructor(port: number = 11000, serviceName: string ) {
        super(port, serviceName);
        this.databaseClient = new DatabaseClient();
        this.router = new Router(this.databaseClient);
        this.router.defineApiRoutes();
    }

    handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
        this.router.route(request, response);
    }
}
