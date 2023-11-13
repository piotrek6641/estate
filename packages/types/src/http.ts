/* eslint-disable no-unused-vars */
import { IncomingMessage, ServerResponse, Server } from "http";
import { ILogger } from "./logger";
import ProxyServer from "http-proxy";
export type HttpHandler = (req: IncomingMessage, res: ServerResponse) => void;

export interface IHttpRouter {
    get: (url: string, handler: HttpHandler) => void;
    post: (url: string, handler: HttpHandler) => void;
    checkIfRouteNotExist: (method: string, url: string) => { statusCode: number; message: string } | undefined;
    route: (req: IncomingMessage, res: ServerResponse) => void;
    initRoutes(): void;
    setProxy(proxy: ProxyServer): void;
}
export interface IHttpServer {
    logger: ILogger;
    port: number;
    handleRequest: (request: IncomingMessage, response: ServerResponse) => void;
    startServer: () => Promise<Server>;
    stopServer: () => void;
}
export interface IHttpServerWithRouter extends IHttpServer{
    router: IHttpRouter;
    handleRequest: (request: IncomingMessage, response: ServerResponse<IncomingMessage>) => void;
}

export const HttpMethod = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
};
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD" | "TRACE" | "CONNECT";
