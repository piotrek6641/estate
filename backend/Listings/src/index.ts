import { createServer } from "http";
import { Logger } from "logger";
import { Router } from "./router";

export class Listings{
    logger = new Logger("Listings");
    port = 11000;
    server;
    router: Router;
    constructor() {
        this.server = this.createServer();
        this.router = new Router();
        this.server.listen(this.port, () => {
            this.logger.info(`Server is listening on port ${this.port}`);
        });

    }
    createServer() {
        return createServer(async (req, res) => {
            this.logger.info("received request", {
                host: req.headers.host,
                url: req.url,
                method: req.method }
            );
            const pathArray = req.url?.split("/").filter(item => item !== "");
            if (pathArray?.length === 0 || pathArray?.length === 1) {
                this.createResponseLog(req.headers.host, 400, "Bad Request");
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({responseStatus: 400, responseMessage: "Bad request"}));
                return;
            }
            if (!req.url) return;
            const {statusCode, message} = await this.router.routeRequest(req.url);
            this.createResponseLog(req.headers.host, statusCode, message);
            res.writeHead(statusCode, { "Content-Type": "text/plain" });
            res.end(message);
        });
    }
    private createResponseLog(host?:string, status?: number, message?: string) {
        this.logger.debug("Sending back response",{ target: {
            host: host
        } , response: {
            responseStatus: status,
            responseMessage: message
        } });
    }
}

