const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");
(async () => {
    const b = await chromium.launch({
        executablePath: path.join(
            process.env.LOCALAPPDATA,
            "ms-playwright/chromium-1248/chrome-win64/chrome.exe",
        ),
    });
    const context = await b.newContext();
    const p = await context.newPage();
    const results = [],
        errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
    });
    await p.goto("http://127.0.0.1:4173/pages/dashboard/calendar.html");
    const fonts = await p.evaluate(async () => {
        await document.fonts.ready;
        return [...document.fonts]
            .filter((face) => face.status === "loaded")
            .map((face) => face.family);
    });
    assert(
        fonts.some((name) => name.includes("Inter")),
        "Inter font loaded",
    );
    assert(
        fonts.some((name) => name.includes("Plus Jakarta Sans")),
        "Plus Jakarta Sans font loaded",
    );
    for (const width of [320, 390, 768, 1024, 1440])
        for (const theme of ["light", "dark"])
            for (const dir of ["ltr", "rtl"]) {
                await p.setViewportSize({ width, height: 1000 });
                await p.evaluate(
                    ({ theme, dir }) => {
                        document.documentElement.dataset.theme = theme;
                        document.documentElement.dir = dir;
                    },
                    { theme, dir },
                );
                await p.waitForTimeout(150);
                assert(
                    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
                );
                results.push({ width, theme, dir, overflow: false });
                if (
                    (width === 390 && theme === "dark" && dir === "rtl") ||
                    (width === 1440 && theme === "light" && dir === "ltr")
                )
                    await p.screenshot({
                        path: `documentation/screenshots/pages-dashboard-calendar-${width}-${theme}-${dir}.png`,
                        fullPage: false,
                    });
            }
    const a = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
    assert.equal(a.violations.length, 0);
    await p.locator(".agenda-session").first().click();
    assert(await p.locator("#detail-dialog").isVisible());
    await p.getByRole("button", { name: "Close details", exact: true }).click();
    await p.locator("#calendar-program").selectOption("leadership");
    assert.equal(await p.locator(".agenda-session").count(), 1);
    await p.goto("http://127.0.0.1:4173/pages/contact.html");
    const input = p.locator("[name=phone]");
    await input.fill("+1 (555) 019-4321");
    assert(await input.evaluate((el) => el.validity.valid));
    assert.equal(errors.length, 0);
    fs.writeFileSync(
        "documentation/calendar-final-audit.json",
        JSON.stringify(
            {
                date: new Date().toISOString(),
                checks: results.length,
                results,
                accessibilityViolations: a.violations.length,
                errors,
                agendaDetails: true,
                programFilter: true,
                phonePattern: true,
                fonts: [...new Set(fonts)],
            },
            null,
            2,
        ),
    );
    console.log(
        "PASS: 20 calendar layout states, accessibility, agenda details, program filter, phone pattern; no browser console errors.",
    );
    await b.close();
})();
