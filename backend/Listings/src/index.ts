import { ServerResponse, createServer } from "http";
import { Logger } from "logger";
//import { Router } from "./router";
import { createProxyServer } from "http-proxy";

export class Listings {
    private logger = new Logger("Listings");
    private port = 11000;
    private server;
    private proxy;
    constructor() {
        this.server = this.createServer();
        this.proxy = this.createProxy();
        this.server.listen(this.port, () => {
            this.logger.info(`Proxy server is listening on port ${this.port}`);
        });
    }

    private createServer() {
        return createServer(async (req, res) => {
            this.logger.info("Received request", {
                host: req.headers.host,
                url: req.url,
                method: req.method
            });

            this.proxy.web(req, res);
        });
    }

    private createProxy() {
        const target = "http://localhost:13000";
        const proxy = createProxyServer({ target });

        proxy.on("error", (err, _req, res) => {
            this.logger.error("Proxy error", { error: err.message });
            (res as ServerResponse).writeHead(500, { "Content-Type": "text/plain" });
            (res as ServerResponse).end("Proxy error");
        });

        proxy.on("end", (req,res) => {
            this.createResponseLog(req.headers.host, res.statusCode, res.statusMessage);
        });

        return proxy;
    }
    private createResponseLog(host?: string, status?: number, message?: string) {
        this.logger.debug("Sending back response",{ target: {
            host: host
        } , response: {
            responseStatus: status,
            responseMessage: message
        } });
    }
}
