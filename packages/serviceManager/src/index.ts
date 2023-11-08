import { Logger } from "logger";
import { ApiGateway } from "apiGateway";
import { Listings } from "listings";
import { DatabaseService } from "databaseService";

export class ServiceManager {
    logger;
    apiGateway;
    listings;
    databaseService;

    constructor () {
        this.logger = new Logger("ServiceManager");
        this.apiGateway = new ApiGateway();
        this.listings = new Listings();
        this.databaseService = new DatabaseService();
        this.logger.debug("Hello from Service Manager");
    }

    doSomething() {
        return;
    }
}
