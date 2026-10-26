const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
(async () => {
    const browser = await chromium.launch({
        executablePath: path.join(
            process.env.LOCALAPPDATA,
            "ms-playwright/chromium-1248/chrome-win64/chrome.exe",
        ),
    });
    const page = await browser.newPage();
    const failures = [],
        errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let checks = 0;
    for (const file of fs.readdirSync("pages").filter((file) => file.endsWith(".html"))) {
        await page.goto("http://127.0.0.1:4173/pages/" + file);
        await page.evaluate(async () => {
            for (const image of document.images) {
                image.loading = "eager";
                await image.decode().catch(() => {});
            }
        });
        const missing = await page
            .locator("img")
            .evaluateAll((images) =>
                images.filter((image) => !image.naturalWidth).map((image) => image.src),
            );
        assert.deepEqual(missing, [], file + " images must load");
        for (const width of [320, 390, 768, 1280, 1440, 1920]) {
            await page.setViewportSize({ width, height: 900 });
            for (const theme of ["light", "dark"])
                for (const dir of ["ltr", "rtl"]) {
                    await page.evaluate(
                        ({ theme, dir }) => {
                            document.documentElement.dir = dir;
                            document.documentElement.dataset.theme = theme;
                        },
                        { theme, dir },
                    );
                    const result = await page.evaluate(() => ({
                        overflow: document.documentElement.scrollWidth > innerWidth + 1,
                        header:
                            document.querySelector(".header-inner").scrollWidth > innerWidth + 1,
                        hero: document.querySelectorAll(".premium-hero").length,
                        h1: document.querySelectorAll("h1").length,
                        croppedContent: [
                            ...document.querySelectorAll("main img:not(.hero-photograph)"),
                        ]
                            .filter(
                                (image) =>
                                    image.naturalWidth &&
                                    getComputedStyle(image).objectFit !== "contain" &&
                                    !(
                                        innerWidth >= 1101 &&
                                        /\/(about-center|case-study-team)\.webp$/.test(image.src)
                                    ),
                            )
                            .map((image) => image.src),
                    }));
                    if (
                        result.overflow ||
                        result.header ||
                        result.hero !== 1 ||
                        result.h1 !== 1 ||
                        result.croppedContent.length
                    )
                        failures.push({ file, width, theme, dir, ...result });
                    checks++;
                }
        }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("http://127.0.0.1:4173/pages/index.html");
    await page.evaluate(() => {
        document.documentElement.dataset.theme = "light";
        document.documentElement.dir = "ltr";
    });
    await page.hover('[aria-controls="home-menu"]');
    assert(await page.locator("#home-menu").isVisible());
    await page.keyboard.press("Escape");
    assert(!(await page.locator("#home-menu").isVisible()));
    const control = page.locator("[data-theme-toggle]");
    const before = await control.evaluate((element) => getComputedStyle(element).backgroundColor);
    await control.hover();
    await page.waitForTimeout(250);
    assert.notEqual(
        await control.evaluate((element) => getComputedStyle(element).backgroundColor),
        before,
    );
    await page.locator("[data-rtl-toggle]").click();
    assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
    const sizes = await page.evaluate(() => ({
        paragraph: getComputedStyle(document.querySelector("main p")).fontSize,
        trust: getComputedStyle(document.querySelector(".trust p")).fontSize,
    }));
    assert.equal(sizes.paragraph, "16px");
    assert.equal(sizes.trust, "16px");
    await page.locator("[data-rtl-toggle]").click();
    await page.mouse.move(900, 100);
    for (const [name, selector] of [
        ["home", ".premium-hero"],
        ["cards", ".benefits-grid"],
        ["photos", ".case"],
    ]) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.screenshot({
            path: "documentation/screenshots/premium-" + name + "-desktop.png",
        });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:4173/pages/index.html");
    await page.screenshot({ path: "documentation/screenshots/premium-home-mobile.png" });
    fs.writeFileSync(
        "documentation/premium-audit.json",
        JSON.stringify({ checks, failures, errors }, null, 2),
    );
    console.log(JSON.stringify({ checks, failures, errors }, null, 2));
    await browser.close();
    if (failures.length || errors.length) process.exitCode = 1;
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
