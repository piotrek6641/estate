import { IncomingMessage, ServerResponse } from "http";
import { HttpMethod } from "./../utils/index";

export type RequestString<Method extends HttpMethod, URL extends string> = `${Method} ${URL}`;
type RouteConfig = {
    [route: RequestString<HttpMethod, string>]: (req: IncomingMessage, res: ServerResponse) => void;
};

export function defineApiRoutes() : RouteConfig{
    const routes: RouteConfig = {
        "GET /get-all": (_req, res) => {
            res.end("Handling GET /get-all");
        },
        "POST /add-listing": (_req, res) => {
            res.end("Handling POST /add-listing");
        },
    };

    return routes;
}
