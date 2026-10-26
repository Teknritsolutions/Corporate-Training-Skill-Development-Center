const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const base = "http://127.0.0.1:4173";
const executable = path.join(
    process.env.LOCALAPPDATA,
    "ms-playwright/chromium-1248/chrome-win64/chrome.exe",
);
(async () => {
    const browser = await chromium.launch({
        headless: true,
        executablePath: fs.existsSync(executable) ? executable : undefined,
    });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
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
    const widths = [320, 360, 375, 390, 420, 480, 640, 768, 820, 1024, 1280, 1440, 1920];
    const failures = [];
    let checks = 0;
    fs.mkdirSync("documentation/screenshots", { recursive: true });
    for (const url of pages) {
        await page.goto(base + "/" + url);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
            for (const image of document.images) {
                image.loading = "eager";
                await image.decode().catch(() => {});
            }
        });
        await page.waitForTimeout(60);
        for (const theme of ["light", "dark"])
            for (const dir of ["ltr", "rtl"]) {
                await page.evaluate(
                    ({ theme, dir }) => {
                        document.documentElement.dataset.theme = theme;
                        document.documentElement.dir = dir;
                    },
                    { theme, dir },
                );
                for (const width of widths) {
                    await page.setViewportSize({ width, height: 900 });
                    await page.waitForTimeout(100);
                    const result = await page.evaluate(() => ({
                        overflow: document.documentElement.scrollWidth > innerWidth + 1,
                        h1: document.querySelectorAll("h1").length,
                        broken: [...document.images]
                            .filter((i) => i.complete && !i.naturalWidth)
                            .map((i) => i.src),
                    }));
                    checks++;
                    if (result.overflow || result.h1 !== 1 || result.broken.length)
                        failures.push({ url, theme, dir, width, ...result });
                }
            }
        for (const mode of [
            { width: 1440, theme: "light", dir: "ltr" },
            { width: 390, theme: "dark", dir: "rtl" },
        ]) {
            await page.setViewportSize({ width: mode.width, height: 1000 });
            await page.evaluate((mode) => {
                document.documentElement.dataset.theme = mode.theme;
                document.documentElement.dir = mode.dir;
            }, mode);
            await page.waitForTimeout(200);
            await page.screenshot({
                path:
                    "documentation/screenshots/" +
                    url
                        .replaceAll("/", "-")
                        .replace(".html", `-${mode.width}-${mode.theme}-${mode.dir}.png`),
            });
        }
        if (["pages/index.html", "pages/home-2.html", "pages/dashboard/index.html"].includes(url)) {
            await page.evaluate(() => {
                document.documentElement.dataset.theme = "light";
                document.documentElement.dir = "ltr";
            });
            await page.setViewportSize({ width: 1440, height: 1000 });
            await page.evaluate(async () => {
                for (const i of document.images) {
                    i.loading = "eager";
                    await i.decode().catch(() => {});
                }
            });
            await page.screenshot({
                path:
                    "documentation/screenshots/" +
                    url.replaceAll("/", "-").replace(".html", ".png"),
                fullPage: true,
            });
        }
    }
    const result = {
        date: new Date().toISOString(),
        pages: pages.length,
        checks,
        widths,
        errors: [...new Set(errors)],
        failures,
    };
    fs.writeFileSync("documentation/browser-audit.json", JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ ...result, failures: failures.slice(0, 30) }, null, 2));
    await browser.close();
    if (failures.length || errors.length) process.exitCode = 1;
})();
