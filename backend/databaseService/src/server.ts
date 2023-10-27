import * as http from "http";

export class DbServer {
    private server: http.Server;
    private port: number;
    constructor() {
        this.server = http.createServer();
        this.port = 13000;
        this.server.on("request", (req, res) => {
            this.handleRequest(req, res);
        });
    }

    private handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
        console.log("got request");
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end("Hello, World!\n");
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
