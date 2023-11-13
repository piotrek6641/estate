import { HttpHandler } from "@estates/types";
import { IncomingMessage, ServerResponse } from "http";
import Server from "http-proxy";

export abstract class AbstractHttpRouter {
    private routes: { [key: string]: { [key: string]: HttpHandler } };
    protected proxy?: Server;

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
    checkIfRouteNotExist(method: string, url: string) {
        if (!this.routes[method] || !this.routes[method][url]) {
            return { statusCode: 404, message: "Not Found" };
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
    setProxy(proxy: Server) {
        this.proxy = proxy;
    }
}
