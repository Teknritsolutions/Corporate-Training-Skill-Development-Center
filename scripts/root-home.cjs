const fs = require("node:fs");
const path = require("node:path");

function apply() {
    const root = path.resolve(__dirname, "..");
    const html = fs.readFileSync(path.join(root, "pages/index.html"), "utf8");
    const homepage = html.replace(/\b(href|src|action)="([^\"]+)"/g, (match, attribute, url) => {
        if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(url)) return match;
        const resolved = url.startsWith("../") ? url.slice(3) : `pages/${url}`;
        return `${attribute}="${resolved}"`;
    });
    fs.writeFileSync(path.join(root, "index.html"), homepage);
}

module.exports = { apply };
if (require.main === module) apply();
