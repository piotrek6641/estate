// import mysql = require("mysql2");
import { DockerClient } from "./docker";
import { Logger } from "@estates/logger";
import { MongoClient } from "mongodb";
import { DbServer } from "./server";

export class DatabaseService {
    logger;
    dockerClient: DockerClient;
    dbServer: DbServer;
    connectionString = "mongodb://localhost:27017/mydatabase";
    constructor() {
        this.dockerClient = new DockerClient();
        this.logger = new Logger("DatabaseService");
        this.dbServer = new DbServer(13000,"dbServer");
    }
    public async init() {
        //await this.startDB();
        await this.startServer();
    }
    private async startDB() {
        try {
            await this.pullImage();
            await this.startImage();
            await this.sendHandshake();
        } catch (error) {
            this.logger.error("Error starting the database");
            throw error;
        }
    }
    private async startServer() {
        await this.dbServer.startServer();
    }
    private async pullImage() {
        return this.dockerClient.pullDBImage()
            .catch((e) => {
                this.logger.error("failed to pull db image");
                throw new Error(e);
            });
    }
    private async startImage() {
        return this.dockerClient.createAndStartDockerContainer()
            .then(async () => {
                return await this.dockerClient.waitForContainerToBoot();
            });
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
