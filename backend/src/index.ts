import { createServer } from "http";

const port = 8080;

const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, World!\n");
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
