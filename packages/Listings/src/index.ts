import { ListingsServer } from "./server";

export class Listings {
    server;
    constructor (port?: number) {
        this.server = new ListingsServer(port, "Listings");
    }
    async startServer() {
        await this.server.startServer();
    }
}
