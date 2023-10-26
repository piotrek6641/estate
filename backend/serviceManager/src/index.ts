import { Logger } from "logger";
import { ApiGateway } from "apiGateway";
import { Listings } from "listings";

export class ServiceManager {
    logger;
    apiGateway;
    listings;

    constructor () {
        this.logger = new Logger("ServiceManager");
        this.apiGateway = new ApiGateway();
        this.listings = new Listings();
        this.apiGateway.logger.pipe(this.logger);

        this.logger.debug("Hello from Service Manager");
    }

    doSomething() {
        return;
    }
}
