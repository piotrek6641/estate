import http = require('http');
import { createProxyServer } from "http-proxy"

const proxy = createProxyServer();

const gateway = http.createServer((req, res) => {
    const routes: { [key: string]: string } = {
    'service1': 'http://localhost:11000'
    };
    if (!req.url) return
    const path = req.url.split('/')[1]; // Extract the first part of the path
    console.log(path)

  // Check if the path is in the routes object
    if (routes[path]) {
    const target = routes[path];
    proxy.web(req, res, { target });
    } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
    }
});

const port = 3000; // Set the port you want to listen on
gateway.listen(port, () => {
    console.log(`Complex Gateway API listening on port ${port}`);
});
