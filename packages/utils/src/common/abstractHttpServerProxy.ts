import { AbstractHttpServer } from "./abstractHttpServer";
import { ServerResponse } from "http";
import { createProxyServer } from "http-proxy";


export abstract class AbstractHttpServerProxy extends AbstractHttpServer {
    protected proxy;

    public constructor(port: number, serviceName: string) {
        super(port, serviceName);
        this.proxy = createProxyServer();
        this.handleProxyLogs();
    }

    private handleProxyLogs() {
        this.proxy.on("error", (err, _req, res) => {
            this.logger.error("Proxy error", { error: err.message });
            (res as ServerResponse).writeHead(500, { "Content-Type": "text/plain" });
            (res as ServerResponse).end("Proxy error");
        });

        this.proxy.on("end", (req, res) => {
            this.createResponseLog(req.headers.host, res.statusCode, res.statusMessage);
        });
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
