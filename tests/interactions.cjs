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
    const c = await b.newContext({ viewport: { width: 1440, height: 1000 } }),
        p = await c.newPage(),
        base = "http://127.0.0.1:4173/pages/",
        passed = [];
    const go = (n) => p.goto(base + n + ".html");
    await go("index");
    await p.keyboard.press("Tab");
    assert.equal(await p.locator(":focus").innerText(), "Skip to content");
    await p.keyboard.press("Enter");
    const dropdown = p.locator(".nav-dropdown > button").first();
    await dropdown.focus();
    await p.keyboard.press("ArrowDown");
    assert.equal(await dropdown.getAttribute("aria-expanded"), "true");
    await p.keyboard.press("Escape");
    assert.equal(await dropdown.getAttribute("aria-expanded"), "false");
    await p.locator("[data-theme-toggle]").click();
    const theme = await p.locator("html").getAttribute("data-theme");
    await p.locator("[data-rtl-toggle]").click();
    await go("about");
    assert.equal(await p.locator("html").getAttribute("data-theme"), theme);
    assert.equal(await p.locator("html").getAttribute("dir"), "rtl");
    passed.push(
        "Keyboard skip link, dropdown opening/escape, and cross-page theme/RTL persistence",
    );
    await p.setViewportSize({ width: 320, height: 800 });
    await p.locator(".menu-toggle").click();
    assert.equal(await p.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
    await p.keyboard.press("Escape");
    assert.equal(await p.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    passed.push("Public mobile menu and Escape at 320px");
    await go("contact");
    const form = p.locator("[data-demo-form=contact]");
    await form.locator("button[type=submit]").click();
    assert.equal(await form.evaluate((el) => el.checkValidity()), false);
    for (const [name, value] of Object.entries({
        name: "Sample Contact",
        company: "Example Organization",
        email: "contact@example.com",
        phone: "+1 555 019 4321",
        message: "Please arrange a team learning discussion.",
    }))
        await form.locator(`[name=${name}]`).fill(value);
    await form.locator("[name=topic]").selectOption({ label: "Corporate training" });
    await form.locator("[name=consent]").check();
    await form.locator("button[type=submit]").click();
    assert.match(await form.locator(".form-status").innerText(), /saved in this browser/);
    assert.equal(
        await p.evaluate(() => JSON.parse(localStorage.getItem("stackly-inquiries")).length),
        1,
    );
    passed.push("Contact required fields, consent, validation and honest local success state");
    await go("register");
    const reg = p.locator("[data-auth-form]");
    for (const [name, value] of Object.entries({
        name: "Demo Registrant",
        company: "Example Team",
        email: "register@example.com",
        password: "ExamplePass123!",
        confirm: "DifferentPass123!",
    }))
        await reg.locator(`[name=${name}]`).fill(value);
    await reg.locator("[type=checkbox]").check();
    await reg.locator("button[type=submit]").click();
    assert.match(await reg.locator(".form-status").innerText(), /do not match/);
    await reg.locator("[name=confirm]").fill("ExamplePass123!");
    await reg.locator("button[type=submit]").click();
    assert.match(await reg.locator(".form-status").innerText(), /password was not saved/);
    assert(
        !(await p.evaluate(() => localStorage.getItem("stackly-profile").includes("ExamplePass"))),
    );
    passed.push("Registration mismatch handling and no persisted password");
    await go("dashboard/index");
    await p.locator("[data-sidebar-toggle]").click();
    assert.equal(await p.locator(".dashboard-sidebar").evaluate((el) => el.inert), false);
    await p.keyboard.press("Escape");
    assert.equal(await p.locator(".dashboard-sidebar").evaluate((el) => el.inert), true);
    await p.setViewportSize({ width: 1440, height: 1000 });
    await p.locator("[data-sidebar-toggle]").click();
    assert(await p.locator("body").evaluate((el) => el.classList.contains("sidebar-collapsed")));
    await p.locator("[data-sidebar-toggle]").click();
    passed.push("Mobile sidebar focus/inert handling and desktop collapse");
    await go("dashboard/settings");
    const settings = p.locator("#settings-form");
    await settings.locator("[name=attendance]").fill("101");
    await settings.locator("button").click();
    assert.match(await p.locator(".toast").innerText(), /between 1 and 100/);
    await settings.locator("[name=attendance]").fill("75");
    await settings.locator("button").click();
    await p.reload();
    assert.equal(await p.locator("[name=attendance]").inputValue(), "75");
    passed.push("Settings threshold validation and persistence");
    await go("dashboard/employees");
    const target = p.locator("tbody tr").first();
    const person = await target.locator("td").nth(1).innerText();
    await target.getByRole("button", { name: "Delete", exact: true }).click();
    await p.getByRole("button", { name: "Close details", exact: true }).click();
    assert.match(await p.locator("tbody").innerText(), new RegExp(person.split("\n")[0]));
    await target.getByRole("button", { name: "Delete", exact: true }).click();
    await p.getByRole("button", { name: "Confirm deletion", exact: true }).click();
    assert.equal(await p.evaluate(() => Training.data.employees.length), 11);
    assert(
        !(await p.evaluate(() => Training.data.enrollments.some((e) => e.employee === "EMP001"))),
    );
    passed.push("Deletion cancellation, confirmation and cascading data consistency");
    await go("dashboard/index");
    const counts = await p.evaluate(() => ({
        chart: window.trainingCharts
            .find((c) => c.canvas.id === "enrollment-chart")
            .data.datasets[0].data.reduce((a, b) => a + b, 0),
        records: Training.data.enrollments.length,
    }));
    assert.equal(counts.chart, counts.records);
    passed.push("Overview chart totals agree with shared records after deletion");
    const files = fs
        .readdirSync("pages")
        .filter((n) => n.endsWith(".html"))
        .map((n) => n.slice(0, -5))
        .concat(
            fs
                .readdirSync("pages/dashboard")
                .filter((n) => n.endsWith(".html"))
                .map((n) => "dashboard/" + n.slice(0, -5)),
        );
    const accessibility = [];
    for (const file of files) {
        await go(file);
        for (const theme of ["light", "dark"]) {
            await p.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
            await p.waitForTimeout(200);
            const result = await new AxeBuilder({ page: p })
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze();
            accessibility.push({
                page: file,
                theme,
                violations: result.violations.map((v) => ({
                    id: v.id,
                    impact: v.impact,
                    nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
                })),
            });
        }
    }
    fs.writeFileSync(
        "documentation/interaction-audit.json",
        JSON.stringify({ date: new Date().toISOString(), passed, accessibility }, null, 2),
    );
    console.log(
        JSON.stringify(
            {
                passed,
                accessibilityCombinations: accessibility.length,
                violations: accessibility.filter((v) => v.violations.length),
            },
            null,
            2,
        ),
    );
    await b.close();
    if (accessibility.some((v) => v.violations.length)) process.exitCode = 1;
})();
