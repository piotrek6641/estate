import { IncomingMessage, ServerResponse } from "http";
import { createShortendUrl } from "@estates/utils";
import { RequestString, defineApiRoutes } from "./routes";
import { HttpMethod } from "@estates/types";

export class Router {
    private routes = defineApiRoutes();

    public handleRequest(req: IncomingMessage, res: ServerResponse) {
        const url = createShortendUrl(req.url);

        if (!req.method && url) return;

        const method = req.method as HttpMethod;
        const routeKey: RequestString<HttpMethod, string> = `${method} ${url}`;
        const routeHandler = this.routes[routeKey];

        if (routeHandler) {
            routeHandler(req, res);
        } else {
            this.handleNotFound(res);
        }
    }

    private handleNotFound(res: ServerResponse) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
}
