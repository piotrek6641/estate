import { IncomingMessage } from "http";

export class Router {
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
