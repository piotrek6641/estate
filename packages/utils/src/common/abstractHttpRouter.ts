import { HttpHandler } from "@estates/types";
import { IncomingMessage, ServerResponse } from "http";

export abstract class AbstractHttpRouter {
    private routes: { [key: string]: { [key: string]: HttpHandler } };

    constructor() {
        this.routes = {
            GET: {},
            POST: {},
        };
    }
    get(url: string, handler: HttpHandler) {
        this.routes.GET[url] = handler;
    }

    post(url: string, handler: HttpHandler) {
        this.routes.POST[url] = handler;
    }
    protected checkIfRouteNotExist(method: string, url: string) {
        if (!this.routes[method] && !this.routes[method][url]) {
            return { statusCode: 404, message: "not found" };
        }
    }
    route(req: IncomingMessage, res: ServerResponse) {
        const method = req.method as string;
        const url = req.url as string;

        const isRouteNotExisting = this.checkIfRouteNotExist(method, url);
        if (isRouteNotExisting) {
            res.writeHead(isRouteNotExisting.statusCode, { "Content-Type": "text/plain" });
            res.end(isRouteNotExisting.message);
            return;
        }
        this.routes[method][url](req, res);
    }
}
