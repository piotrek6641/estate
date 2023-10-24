import { MongoClient } from "mongodb";

export class databaseClient {
    private uri: string;
    private client: MongoClient;
    constructor() {
        this.uri = process.env.MONGODB_URI as string;
        this.client = new MongoClient(this.uri, { auth: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD }
        });
    }
    async connectToMongoDB() {
        await this.client.connect();
        console.log("connected to db");

        const database = this.client.db("estates");
        const collection = database.collection("houses");

        const result = await collection.listIndexes();

        console.log("Query Result:", result);

        await this.client.close();
    }
    async sendHandshake() {
        await this.client.connect();
        console.log("Handshake Successful");
        await this.client.close();
    }
}
