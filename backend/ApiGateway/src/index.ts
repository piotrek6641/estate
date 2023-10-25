import http = require('http');
import { createProxyServer } from "http-proxy"
import { Logger } from "logger"

const proxy = createProxyServer();
const logger = new Logger;

const gateway = http.createServer((req, res) => {
    const routes: { [key: string]: string } = {
    'service1': 'http://localhost:11000'
    };
    if (!req.url) return
    const path = req.url.split('/')[1]; // Extract the first part of the path

  // Check if the path is in the routes object
    if (routes[path]) {
    const target = routes[path];
    logger.log(`forwarding request to: ${target} (${path})`, "info")
    proxy.web(req, res, { target });
    logger.log(`got response ${res.statusCode} from ${target}`)
    } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
    }
});

const port = 3000; // Set the port you want to listen on
gateway.listen(port, () => {
    logger.log(`Complex Gateway API listening on port ${port}`);
});
