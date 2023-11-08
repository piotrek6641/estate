import { Logger } from "@estates/logger";
import { ApiGateway } from "@estates/api-gateway";
import { Listings } from "@estates/listings";
import { DatabaseService } from "@estates/database-service";

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
