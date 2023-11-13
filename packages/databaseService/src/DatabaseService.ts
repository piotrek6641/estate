// import mysql = require("mysql2");
import { Logger } from "@estates/logger";
import { MongoClient } from "mongodb";

export class DatabaseService {
    logger;
    connectionString = "mongodb://localhost:27017/mydatabase";
    constructor() {
        this.logger = new Logger("DatabaseService");
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
}
