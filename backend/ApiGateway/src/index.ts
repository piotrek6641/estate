import { createServer } from "http";
import { databaseClient } from "./databaseClient/databaseClient";

const port = process.env.PORT;
const dbClient = new databaseClient();
const server = createServer();

server.on("request", async (req, res) => {
    console.log("received new server request", req.method, req.url);
    if (req.url === "/connect-to-db" && req.method === "GET") {
        try {
            await dbClient.sendHandshake();
            res.writeHead(200, { "content-type": "text/plain" });
            res.end("Successfully connected to db ;)");
        } catch {
            res.writeHead(500);
            res.end("Internal server error");
        }
    } else{
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Hello, World!\n");
    }
});
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
