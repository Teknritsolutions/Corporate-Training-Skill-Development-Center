const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const sources = [
    [
        "csa",
        "https://teknritsolutions-2.github.io/Local-Farm-or-Community-Supported-Agriculture-CSA-/pages/public/index.html",
    ],
    ["events", "https://teknrit-maker.github.io/High-End-Event-Planning/pages/index.html"],
    ["bookstore", "https://teknrit-maker.github.io/Local-Indie-Bookstore/pages/index.html"],
    ["food", "https://teknrit-maker.github.io/FoodTruck/Pages/menu.html"],
    ["yarn", "https://ravivarmaadepu123.github.io/boutique-yarn-and-craft-supply/pages/"],
    [
        "bookstore-admin",
        "https://teknrit-maker.github.io/Local-Indie-Bookstore/pages/Admin%20Dashboard.html",
    ],
    [
        "bookstore-user",
        "https://teknrit-maker.github.io/Local-Indie-Bookstore/pages/User%20Dashboard.html",
    ],
    ["events-about", "https://teknrit-maker.github.io/High-End-Event-Planning/pages/about.html"],
    [
        "csa-about",
        "https://teknritsolutions-2.github.io/Local-Farm-or-Community-Supported-Agriculture-CSA-/pages/public/about.html",
    ],
];
(async () => {
    const b = await chromium.launch({
        executablePath: path.join(
            process.env.LOCALAPPDATA,
            "ms-playwright/chromium-1248/chrome-win64/chrome.exe",
        ),
    });
    fs.mkdirSync("documentation/reference-review", { recursive: true });
    const results = [];
    for (const [name, url] of sources) {
        const p = await b.newPage();
        try {
            const r = await p.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
            await p.waitForTimeout(700);
            const info = await p.evaluate(() => ({
                title: document.title,
                headings: [...document.querySelectorAll("h1,h2")]
                    .map((e) => e.textContent.trim())
                    .slice(0, 14),
                font: getComputedStyle(document.body).fontFamily,
                sections: document.querySelectorAll("section").length,
                charts: document.querySelectorAll("canvas").length,
            }));
            for (const width of [1440, 390]) {
                await p.setViewportSize({ width, height: 1000 });
                await p.screenshot({ path: `documentation/reference-review/${name}-${width}.png` });
            }
            results.push({ name, url, status: r.status(), ...info });
        } catch (e) {
            results.push({ name, url, error: e.message });
        }
        await p.close();
    }
    fs.writeFileSync("documentation/reference-review.json", JSON.stringify(results, null, 2));
    console.log(results);
    await b.close();
})();
