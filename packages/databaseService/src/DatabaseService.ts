// import mysql = require("mysql2");
import { Logger } from "@estates/logger";
import { MongoClient } from "mongodb";
import { DbServer } from "./server";

export class DatabaseService {
    logger;
    dbServer: DbServer;
    connectionString = "mongodb://localhost:27017/mydatabase";
    constructor() {
        this.logger = new Logger("DatabaseService");
        this.dbServer = new DbServer(13000,"dbServer");
    }
    public async init() {
        //await this.startDB();
        await this.startServer();
    }
    private async startServer() {
        await this.dbServer.startServer();
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
