const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const pages = fs
    .readdirSync("pages")
    .filter((n) => n.endsWith(".html"))
    .map((n) => "pages/" + n)
    .concat(
        fs
            .readdirSync("pages/dashboard")
            .filter((n) => n.endsWith(".html"))
            .map((n) => "pages/dashboard/" + n),
    );
const errors = [];
const photos = new Map();
for (const file of pages) {
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const url = m[1];
        if (/^(https?:|mailto:|tel:|#|data:)/.test(url)) continue;
        const target = path.resolve(path.dirname(file), url.split(/[?#]/)[0]);
        if (!fs.existsSync(target)) errors.push(file + " missing " + url);
    }
    for (const m of text.matchAll(/<img[^>]+src="([^"]+\.webp)"/g)) {
        const key = path.resolve(path.dirname(file), m[1]);
        if (photos.has(key)) errors.push("Repeated image " + key);
        photos.set(key, file);
    }
    assert.equal((text.match(/<h1[ >]/g) || []).length, 1, file + " one h1");
    if (/â€™|Â·|�/.test(text)) errors.push(file + " broken encoding");
}
for (const name of ["index", "home-2"]) {
    const text = fs
        .readFileSync("pages/" + name + ".html", "utf8")
        .split('<main id="main">')[1]
        .split("</main>")[0];
    assert.equal((text.match(/<section\b/g) || []).length, 10, name + " exactly ten sections");
}
assert.deepEqual(errors, []);
console.log(
    "PASS: " +
        pages.length +
        " pages; local links and assets; unique photos; homepage section counts; encoding.",
);
