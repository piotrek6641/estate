import * as http from "http";
import { validateMethod } from "./utils";
import { Router } from "./router/router";
import { Logger } from "@estates/logger";

export class DbServer {
    private server: http.Server;
    private router: Router;
    private port: number;
    private logger: Logger;

    constructor(logger: Logger, port: number = 13000) {
        this.logger = logger;
        this.port = port;
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

    public async start() {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, () => {
                this.logger.info(`DB Server is running on port ${this.port}`);
                resolve(this.server);
            });
            this.server.on("error", (err) => {
                this.logger.error(`Server failed to start: ${err.message}`);
                reject(err);
            });
        });
    }

    public stop() {
        this.server.close(() => {
            this.logger.warning("Server stopped");
        });
    }
}
