const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
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
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4173/pages/home-2.html");
    assert.equal(await page.locator("main section").count(), 10);
    await page.evaluate(async () => {
        for (const image of document.images) {
            image.loading = "eager";
            await image.decode().catch(() => {});
        }
    });
    assert.deepEqual(
        await page
            .locator("img")
            .evaluateAll((imgs) => imgs.filter((i) => !i.naturalWidth).map((i) => i.src)),
        [],
    );
    const failures = [];
    let checks = 0;
    for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const theme of ["light", "dark"])
            for (const dir of ["ltr", "rtl"]) {
                await page.evaluate(
                    ({ theme, dir }) => {
                        document.documentElement.dataset.theme = theme;
                        document.documentElement.dir = dir;
                    },
                    { theme, dir },
                );
                const result = await page.evaluate(() => {
                    const mismatched = [];
                    for (const grid of document.querySelectorAll(
                        ".home-two .h2-grid,.home-two .h2-duo,.home-two .h2-brief",
                    )) {
                        const rows = new Map();
                        for (const el of grid.children) {
                            const r = el.getBoundingClientRect(),
                                key = Math.round(r.top);
                            if (!rows.has(key)) rows.set(key, []);
                            rows.get(key).push(r.height);
                        }
                        for (const heights of rows.values())
                            if (Math.max(...heights) - Math.min(...heights) > 2)
                                mismatched.push(grid.className);
                    }
                    return {
                        overflow: document.documentElement.scrollWidth > innerWidth + 1,
                        mismatched,
                    };
                });
                if (result.overflow || result.mismatched.length)
                    failures.push({ width, theme, dir, ...result });
                checks++;
            }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    const accessibility = [];
    for (const theme of ["light", "dark"]) {
        await page.evaluate((theme) => {
            document.documentElement.dataset.theme = theme;
            document.documentElement.dir = "ltr";
        }, theme);
        await page.waitForTimeout(350);
        const audit = await new AxeBuilder({ page }).analyze();
        accessibility.push(
            ...audit.violations.map((v) => ({
                theme,
                id: v.id,
                nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
            })),
        );
    }
    await page.locator("#h2-team-size").fill("20");
    await page.locator("#h2-weekly-minutes").fill("60");
    assert.equal(await page.locator("[data-learning-hours]").innerText(), "80");
    assert.equal(await page.locator("[data-practice-minutes]").innerText(), "40");
    assert.equal(await page.locator("[data-reflection-minutes]").innerText(), "20");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download template" }).first().click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "decision-brief.txt");
    assert((await fs.promises.readFile(await download.path(), "utf8")).includes("DECISION BRIEF"));
    await page.evaluate(() => {
        document.documentElement.dataset.theme = "light";
        document.documentElement.dir = "ltr";
    });
    for (const id of [
        "capability-compass",
        "decision-lab",
        "role-playbooks",
        "learning-planner",
        "experiment-studio",
        "coaching-council",
        "working-agreements",
        "takeaway-toolkit",
        "journey-brief",
    ])
        await page
            .locator("#" + id)
            .screenshot({ path: "documentation/screenshots/home-two-" + id + ".png" });
    fs.writeFileSync(
        "documentation/home-two-audit.json",
        JSON.stringify({ sections: 10, checks, failures, errors, accessibility }, null, 2),
    );
    console.log(JSON.stringify({ sections: 10, checks, failures, errors, accessibility }, null, 2));
    await browser.close();
    if (failures.length || errors.length || accessibility.length) process.exitCode = 1;
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
