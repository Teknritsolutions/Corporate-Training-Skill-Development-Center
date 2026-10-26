const { chromium } = require("playwright"),
    AxeBuilder = require("@axe-core/playwright").default,
    fs = require("fs"),
    path = require("path"),
    assert = require("assert/strict");
(async () => {
    const b = await chromium.launch({
        executablePath: path.join(
            process.env.LOCALAPPDATA,
            "ms-playwright/chromium-1248/chrome-win64/chrome.exe",
        ),
    });
    const c = await b.newContext(),
        p = await c.newPage();
    const failures = [],
        errors = [],
        accessibility = [];
    let checks = 0;
    p.on("pageerror", (e) => errors.push(e.message));
    for (const file of fs.readdirSync("pages").filter((n) => n.endsWith(".html"))) {
        await p.goto("http://127.0.0.1:4173/pages/" + file);
        await p.evaluate(async () => {
            for (const i of document.images) {
                i.loading = "eager";
                await i.decode().catch(() => {});
            }
        });
        const missing = await p
            .locator("img")
            .evaluateAll((a) => a.filter((i) => !i.naturalWidth).map((i) => i.src));
        if (missing.length) failures.push({ file, missing });
        for (const width of [320, 390, 768, 1280, 1440, 1920]) {
            await p.setViewportSize({ width, height: 1000 });
            for (const dir of ["ltr", "rtl"]) {
                await p.evaluate((d) => (document.documentElement.dir = d), dir);
                const r = await p.evaluate(() => ({
                    overflow: document.documentElement.scrollWidth > innerWidth + 1,
                    h1: document.querySelectorAll("h1").length,
                    hero: document.querySelectorAll(".premium-hero").length,
                    ids: [...document.querySelectorAll("[id]")]
                        .map((e) => e.id)
                        .filter((id, i, a) => a.indexOf(id) !== i),
                    paragraph: [...document.querySelectorAll("main p")]
                        .filter((e) => getComputedStyle(e).fontSize !== "16px")
                        .map((e) => ({
                            text: e.textContent.slice(0, 40),
                            size: getComputedStyle(e).fontSize,
                        })),
                    brokenAnchors: [...document.querySelectorAll("main .vh-action")]
                        .filter((a) => a.hash && !document.getElementById(a.hash.slice(1)))
                        .map((a) => a.hash),
                }));
                if (
                    r.overflow ||
                    r.h1 !== 1 ||
                    r.hero !== 1 ||
                    r.ids.length ||
                    r.paragraph.length ||
                    r.brokenAnchors.length
                )
                    failures.push({ file, width, dir, ...r });
                checks++;
            }
        }
        await p.setViewportSize({ width: 1440, height: 1000 });
        for (const theme of ["light", "dark"]) {
            await p.evaluate((t) => {
                document.documentElement.dataset.theme = t;
                document.documentElement.dir = "ltr";
            }, theme);
            await p.waitForTimeout(350);
            const a = await new AxeBuilder({ page: p }).analyze();
            accessibility.push(
                ...a.violations.map((v) => ({
                    file,
                    theme,
                    id: v.id,
                    nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
                })),
            );
        }
        await p.evaluate(() => (document.documentElement.dataset.theme = "light"));
        if (!["index.html", "home-2.html"].includes(file))
            await p.locator(".premium-hero").screenshot({
                path: "documentation/screenshots/hero-variant-" + file.replace(".html", ".png"),
            });
        if (file === "about.html") {
            const pos = await p.locator(".leadership-copy").evaluateAll((a) =>
                a.map((e) => {
                    const h = e.querySelector("h3").getBoundingClientRect(),
                        r = e.querySelector(".leadership-role").getBoundingClientRect(),
                        p = e.querySelector("p").getBoundingClientRect();
                    return [h.top, r.top, p.top];
                }),
            );
            for (let i = 0; i < 3; i++)
                assert(Math.max(...pos.map((a) => a[i])) - Math.min(...pos.map((a) => a[i])) < 2);
            await p
                .locator(".leadership-grid")
                .screenshot({ path: "documentation/screenshots/about-team-aligned.png" });
        }
    }
    fs.writeFileSync(
        "documentation/inner-pages-audit.json",
        JSON.stringify({ checks, failures, errors, accessibility }, null, 2),
    );
    console.log(JSON.stringify({ checks, failures, errors, accessibility }, null, 2));
    await b.close();
    if (failures.length || errors.length || accessibility.length) process.exitCode = 1;
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
