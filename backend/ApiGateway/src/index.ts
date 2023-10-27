import http = require("http");
import { createProxyServer } from "http-proxy";
import { Logger } from "logger";

export class ApiGateway {
    proxy = createProxyServer();
    logger = new Logger("ApiGateway");
    port = 3000;
    gateway;

    constructor() {
        this.gateway = this.createServer();

        this.gateway.listen(this.port, () => {
            this.logger.info(`Complex Gateway API listening on port ${this.port}`);
        });

    }

    createServer() {
        return http.createServer((req, res) => {
            const routes: { [key: string]: string } = {
                "service1": "http://localhost:11000"
            };
            if (!req.url) return;
            const path = req.url.split("/")[1];

            if (routes[path]) {
                const target = routes[path];

                this.logger.info(`forwarding request to: ${target} (${path})`);
                try {
                    this.proxy.web(req, res, { target }, (err) => {
                        if (err) {
                            this.logger.error(`Error when forwarding request to ${target}: ${err.message}`);
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            res.end("Proxy Error");
                        }
                    });
                    this.logger.info(`got response ${res.statusCode} from ${target}`);
                } catch(e) {
                    this.logger.warning(e as string);
                }
            } else {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Route not found");
            }
        });
    }

}
