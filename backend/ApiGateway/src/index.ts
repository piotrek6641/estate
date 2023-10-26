import http = require("http");
import { createProxyServer } from "http-proxy";
import { Logger } from "logger";

const proxy = createProxyServer();
const logger = new Logger("ApiGateway");

const gateway = http.createServer((req, res) => {
    const routes: { [key: string]: string } = {
        "service1": "http://localhost:11000"
    };
    if (!req.url) return;
    const path = req.url.split("/")[1];

    if (routes[path]) {
        const target = routes[path];
        logger.info(`forwarding request to: ${target} (${path})`);
        proxy.web(req, res, { target });
        logger.info(`got response ${res.statusCode} from ${target}`);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Route not found");
    }
});

const port = 3000;
gateway.listen(port, () => {
    logger.info(`Complex Gateway API listening on port ${port}`);
});
