import { MongoClient } from "mongodb";

export async function connectToMongoDB() {
    const uri = process.env.MONGODB_URI as string;

    const client = new MongoClient(uri, { auth: { username: process.env.DB_USERNAME, password: process.env.DB_PASSWORD }  });
    await client.connect();
    console.log("connected to db");

    const database = client.db("estates");
    const collection = database.collection("houses");

    const result = await collection.listIndexes();

    console.log("Query Result:", result);

    await client.close();
}
