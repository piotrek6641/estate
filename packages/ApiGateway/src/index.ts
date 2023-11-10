import { AbstractHttpServerProxy } from "@estates/utils";
import { IncomingMessage, ServerResponse } from "http";
export class ApiGateway extends AbstractHttpServerProxy {
    routes: { [key: string]: string } = {
        "service1": "http://localhost:11000",
    };
    constructor () {
        super(3000,"API-GATEWAY");
    }
    handleRequest(request: IncomingMessage, response: ServerResponse<IncomingMessage>): void {
        const url = request.url;
        if (!url) return;
        const path = url.split("/")[1];
        if (this.routes[path]) {
            const target = this.routes[path];
            this.logger.info(`forwarding request to: ${target} (${path})`);
            try {
                this.proxy.web(request, response, { target }, (err) => {
                    if (err) {
                        this.logger.error(`Error when forwarding request to ${target}: ${err.message}`);
                        response.writeHead(500, { "Content-Type": "text/plain" });
                        response.end("Proxy Error");
                    }
                });
            } catch (e) {
                this.logger.warning(e as string);
            }
        } else {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.end("Route not found");
        }
        this.proxy.web(request ,response, { target: "http://localhost:13000" });
    }
}
