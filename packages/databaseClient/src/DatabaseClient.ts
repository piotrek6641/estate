import { listingSchema } from "@estates/database-schemas";
import { Logger } from "@estates/logger";
import { IListing } from "@estates/types";
import { MongoClient } from "mongodb";
import { model, connect } from "mongoose";

export class DatabaseClient {
    logger;
    connectionString = "mongodb://localhost:27017";
    constructor() {
        this.logger = new Logger("DatabaseService");
        this.sendHandshake();
    }
    private async sendHandshake() {
        try {
            const client = new MongoClient(this.connectionString, {});
            await client.connect();

            client.close();
            this.logger.info("DB handshake sent successfully");
        } catch (error) {
            this.logger.error("Error connecting to MongoDB:" + error);
        }
    }
    public async addNewListing(reqBody: IListing) {
        const Listing = model<IListing>("Listing", listingSchema);
        await connect(this.connectionString, {
            auth: {
                username: "admin",
                password: "password",
            },
        });
        const listing = new Listing({
            title: reqBody.title,
            bathrooms: reqBody.bathrooms,
            bedrooms: reqBody.bedrooms,
            description: reqBody.description,
            price: reqBody.price,
        });
        return (await listing.save())._id.toJSON();
    }
    public async getListing(id: string) {
        await connect(this.connectionString, {
            auth: {
                username: "admin",
                password: "password",
            },
        });
        const Listing = model<IListing>("Listing", listingSchema);
        return await Listing.findById(id);
    }

}
