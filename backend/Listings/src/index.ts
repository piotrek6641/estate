import { createServer } from 'http';

const server = createServer((req, res) => {
    console.log("received request", `host: ${req.headers.host}`, `url: ${req.url}`, `method: ${req.method}`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, this is a simple server!\n');
});

const port = 11000;

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
