import { listingSchema } from "@estates/database-schemas";
import { Logger } from "@estates/logger";
import { IListing } from "@estates/types";
import { MongoClient } from "mongodb";
import { model, connect, disconnect } from "mongoose";

export class DatabaseClient {
    logger;
    connectionString = "mongodb://localhost:27017";
    constructor() {
        this.logger = new Logger("DatabaseService");
        this.sendHandshake();
    }
    private async connect() {
        await connect(this.connectionString, {
            auth: {
                username: "admin",
                password: "password",
            },
        });
    }
    private async disconnect() {
        await disconnect();
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
        this.connect();
        const listing = new Listing({
            title: reqBody.title,
            bathrooms: reqBody.bathrooms,
            bedrooms: reqBody.bedrooms,
            description: reqBody.description,
            price: reqBody.price,
        });
        const id = (await listing.save())._id.toJSON();
        await this.disconnect();

        return id;
    }
    public async getListing(id: string) {
        await this.connect();
        const Listing = model<IListing>("Listing", listingSchema);
        const result = await Listing.findById(id);
        this.disconnect();
        return result;
    }
    public async getAll() {
        await this.connect();
        const Listings = model<IListing>("Listing", listingSchema);
        const result = await Listings.find({});
        this.disconnect();
        return result;
    }

}
