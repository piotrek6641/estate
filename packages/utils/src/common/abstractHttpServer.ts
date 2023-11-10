import { Logger } from "@estates/logger";
import { ILogger } from "@estates/types";
import { Server, createServer, IncomingMessage, ServerResponse } from "http";
export abstract class AbstractHttpServer {
    protected server: Server;
    public logger: ILogger;
    protected port: number;
    public constructor(port: number, serviceName: string ) {
        this.port = port;
        this.logger = new Logger(serviceName);
        this.logger.info("starting service");
        this.server = createServer(this.handleRequest.bind(this));
    }
    // eslint-disable-next-line no-unused-vars
    abstract handleRequest(request: IncomingMessage, response: ServerResponse): void;
    public async startServer() {
        return new Promise((resolve, reject) => {
            this.server.listen(this.port, () => {
                this.logger.info(`Server is running on port ${this.port}`);
                resolve(this.server);
            });
            this.server.on("error", (err) => {
                this.logger.error(`Server failed to start: ${err.message}`);
                reject(err);
            });
        });
    }

    public stopServer() {
        this.server.closeAllConnections();
    }
}
