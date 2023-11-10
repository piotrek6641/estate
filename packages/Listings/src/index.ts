//import { Router } from "./router";
import { AbstractHttpServerProxy } from "@estates/utils";
import { IncomingMessage, ServerResponse } from "http";

export class Listings extends AbstractHttpServerProxy {
    constructor () {
        super(11000,"Listings");
    }
    handleRequest(request: IncomingMessage, response: ServerResponse<IncomingMessage>): void {
        this.proxy.web(request ,response, { target:"http://localhost:13000" });
    }
}
