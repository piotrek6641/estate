import http = require("http");
import { createProxyServer } from "http-proxy";
import { Logger } from "@estates/logger";
export class ApiGateway {
    proxy = createProxyServer();
    logger = new Logger("ApiGateway");
    port = 3000;
    routes: { [key: string]: string } = {
        "service1": "http://localhost:11000",
    };
    proxyOptions = {
        followRecirects: true,
        toProxy: true,
    };
    gateway: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | undefined;

    public async init() {
        this.gateway = this.createServer();
        this.gateway.listen(this.port, () => {
            this.logger.info(`API Gateway listening on port ${this.port}`);
        });
    }

    private createServer() {
        return http.createServer((req, res) => {
            if (!req.url) return;
            const path = req.url.split("/")[1];

            if (this.routes[path]) {
                const target = this.routes[path];
                const proxyOptions = Object.keys(this.proxyOptions);
                this.logger.info(`forwarding request to: ${target} (${path})`);
                try {
                    this.proxy.web(req, res, { ...proxyOptions, target }, (err) => {
                        if (err) {
                            this.logger.error(`Error when forwarding request to ${target}: ${err.message}`);
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Proxy Error");
                        }
                    });
                } catch (e) {
                    this.logger.warning(e as string);
                }
            } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Route not found");
            }
        });
    }
}
