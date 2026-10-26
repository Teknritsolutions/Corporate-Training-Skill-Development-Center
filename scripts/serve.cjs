const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".png": "image/png",
    ".woff2": "font/woff2",
};
http.createServer((req, res) => {
    let file = path.resolve(root, "." + decodeURIComponent(req.url.split("?")[0]));
    if (!file.startsWith(root + path.sep) && file !== root) {
        res.writeHead(403).end();
        return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
        file = path.join(file, "index.html");
    fs.readFile(file, (error, data) => {
        res.writeHead(error ? 404 : 200, {
            "Content-Type": types[path.extname(file)] || "application/octet-stream",
        });
        res.end(error ? "Page not found" : data);
    });
}).listen(4173, "127.0.0.1", () => console.log("Elevora: http://127.0.0.1:4173"));
