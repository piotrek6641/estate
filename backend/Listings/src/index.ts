import { createServer } from 'http';
import Logger from 'logger';

const logger = Logger
const server = createServer((req, res) => {
    logger.info("received request", `host: ${req.headers.host}`, `url: ${req.url}`, `method: ${req.method}`)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, this is a simple server!\n');
});

const port = 11000;

server.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
});
