// import mysql = require("mysql2");
import { DockerClient } from "./docker";
import { Logger } from "logger";
import { MongoClient } from "mongodb";
import { DbServer } from "./server";

export class DatabaseService{
    logger;
    dockerClient: DockerClient;
    dbServer: DbServer;
    constructor() {
        this.dockerClient = new DockerClient();
        this.logger = new Logger("DatabaseService");
        this.dbServer = new DbServer();
        this.startDB();
        this.startServer();
    }
    async startDB() {
        try {
            await this.pullImage();
            await this.startImage();
            await this.sendHandshake();
        } catch (error) {
            this.logger.error("Error starting the database:" + error);
        }
    }
    async startServer() {
        this.dbServer.start();
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
        const connectionString = "mongodb://localhost:27017/mydatabase";

        try {
            const client = new MongoClient(connectionString, {
            });
            await client.connect();

            this.logger.info("Connected to MongoDB");

            client.close();
            this.logger.info("Connection closed");
        } catch (error) {
            this.logger.error("Error connecting to MongoDB:" + error);
        }
    }

}
