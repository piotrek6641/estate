import { Logger } from "@estates/logger";
import { ApiGateway } from "@estates/api-gateway";
import { Listings } from "@estates/listings";
import { DatabaseService } from "@estates/database-service";
import { EventBus } from "@estates/event-bus";


export class ServiceManager {
    logger;
    apiGateway;
    listings;
    databaseService;
    eventBus: EventBus;

    constructor () {
        this.eventBus = EventBus.getInstance();
        this.logger = new Logger("ServiceManager");
        this.apiGateway = new ApiGateway();
        this.listings = new Listings();
        this.databaseService = new DatabaseService();
        this.logger.debug("Hello from Service Manager");
    }
    async start() {
        await Promise.all([
            await this.apiGateway.init(),
            this.listings.init(),
            await this.databaseService.init(),
        ]);
        this.eventBus.publish("init-state", "finished" );
        this.logger.info("successfully started all services, API is ready to use");
        return "OK";
    }
}
