import { IncomingMessage, Server, ServerResponse, createServer } from "http";
import { Logger } from "@estates/logger";
//import { Router } from "./router";
import { createProxyServer } from "http-proxy";

export class Listings {
    private logger = new Logger("Listings");
    private port = 11000;
    private server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
    private proxy: import("http-proxy") <IncomingMessage, ServerResponse<IncomingMessage>> | undefined;
    public init() {
        this.proxy = this.createProxy();
        this.server = this.createServer();
        this.server.listen(this.port, () => {
            this.logger.info(`Proxy server is listening on port ${this.port}`);
        });
    }

    private createServer() {
        const server = createServer(async (req, res) => {
            this.logger.info("Received request", {
                host: req.headers.host,
                url: req.url,
                method: req.method,
            });
            if (!this.proxy) return;
            this.proxy.web(req, res);


        });
        return server;
    }

    private createProxy() {
        const target = "http://localhost:13000";
        const proxy = createProxyServer({ target });

        proxy.on("error", (err, _req, res) => {
            this.logger.error("Proxy error", { error: err.message });
            (res as ServerResponse).writeHead(500, { "Content-Type": "text/plain" });
            (res as ServerResponse).end("Proxy error");
        });

        proxy.on("end", (req, res) => {
            this.createResponseLog(req.headers.host, res.statusCode, res.statusMessage);
        });

        return proxy;
    }
    private createResponseLog(host?: string, status?: number, message?: string) {
        this.logger.debug("Sending back response",{ target: {
            host: host,
        } , response: {
            responseStatus: status,
            responseMessage: message,
        } });
    }
}
