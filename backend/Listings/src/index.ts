import { createServer } from "http";
import { Logger } from "logger";

export class Listings{
    logger = new Logger("Listings");
    port = 11000;
    server;
    constructor() {
        this.server = this.createServer();
        this.server.listen(this.port, () => {
            this.logger.info(`Server is listening on port ${this.port}`);
        });

    }
    createServer() {
        return createServer((req, res) => {
            this.logger.info(`received request { host: ${req.headers.host}url: ${req.url} method: ${req.method} }`);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Hello, this is a simple server!\n");
        });
    }
}

