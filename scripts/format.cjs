const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
function files(dir) {
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .flatMap((e) =>
            e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)],
        );
}
(async () => {
    const list = [
        "index.html",
        ...files("pages"),
        ...files("assets/css"),
        ...files("assets/js"),
        ...files("scripts"),
        ...files("tests"),
        "documentation/index.html",
    ].filter((p) => /\.(html|css|js|cjs)$/.test(p));
    for (const file of list) {
        fs.writeFileSync(
            file,
            await prettier.format(fs.readFileSync(file, "utf8"), {
                filepath: file,
                tabWidth: 4,
                printWidth: 100,
                htmlWhitespaceSensitivity: "ignore",
                endOfLine: "lf",
            }),
        );
    }
    console.log("Formatted " + list.length + " source files.");
})();
