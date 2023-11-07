import * as http from "http";
import { validateMethod } from "./utils";
import { Router } from "./router/router";

export class DbServer {
    private server: http.Server;
    private router: Router;

    constructor(private port: number = 13000) {
        this.router = new Router();
        this.server = http.createServer((req, res) => {
            this.router.handleRequest(req, res);
        });
    }

    private handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
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

    public start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    public stop() {
        this.server.close(() => {
            console.log("Server stopped");
        });
    }
}
