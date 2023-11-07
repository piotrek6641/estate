import { IncomingMessage, ServerResponse } from "http";
import { createShortendUrl } from "estate-utils";
import { RequestString, defineApiRoutes } from "./routes";
import { HttpMethod } from "../utils";

export class Router {
    private routes = defineApiRoutes();

    public handleRequest(req: IncomingMessage, res: ServerResponse) {
        const url = createShortendUrl(req.url);
        console.log(url);
        const routeKey: RequestString<HttpMethod, string> = `${req.method} ${url}`;
        console.log(this.routes);
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
    routeRequest(request: IncomingMessage) : { code: number, message:string } | void {
        if (!request.url) return;
        const url = request.url.split("/")[2];
        console.log(url);
        switch (url) {
        case "get-all":
            return { code: 200, message: "some data" };
        default:
            return { code: 404, message: "Route not found" };
        }
    }
}
