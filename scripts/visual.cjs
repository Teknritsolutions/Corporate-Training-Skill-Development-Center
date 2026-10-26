const fs = require("fs");
const { spawnSync } = require("child_process");
for (const [group, filter, columns, size] of [
    ["public", (n) => !n.includes("dashboard"), 4, "320x222"],
    ["dashboard", (n) => n.includes("dashboard"), 4, "320x222"],
    ["mobile", () => true, 8, "155x400"],
]) {
    const suffix = group === "mobile" ? "-390-dark-rtl.png" : "-1440-light-ltr.png";
    const files = fs
        .readdirSync("documentation/screenshots")
        .filter((n) => n.endsWith(suffix) && filter(n))
        .map((n) => "documentation/screenshots/" + n);
    if (!files.length) continue;
    const r = spawnSync(
        "magick",
        [
            "montage",
            ...files,
            "-thumbnail",
            size,
            "-tile",
            columns + "x",
            "-geometry",
            "+8+8",
            "documentation/screenshots/contact-sheet-" + group + ".png",
        ],
        { encoding: "utf8" },
    );
    if (r.error) throw r.error;
    if (r.status) throw Error(r.stderr);
    console.log(group, files.length);
}
