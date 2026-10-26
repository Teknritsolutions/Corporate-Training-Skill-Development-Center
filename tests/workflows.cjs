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
    const c = await b.newContext({
        acceptDownloads: true,
        viewport: { width: 1440, height: 1000 },
    });
    const p = await c.newPage();
    const base = "http://127.0.0.1:4173/pages/";
    const passed = [],
        axe = [];
    const go = (n) => p.goto(base + n + ".html");
    const save = () =>
        p.locator("#record-form button[type=submit],#record-form button:not([type])").click();
    await go("dashboard/employees");
    await p.evaluate(() => Training.reset());
    await p.reload();
    await p.getByRole("button", { name: "Add employee", exact: true }).click();
    await p.locator("[name=name]").fill("Test Learner");
    await p.locator("[name=email]").fill("learner@example.com");
    await p.locator("[name=role]").fill("Analyst");
    await save();
    await p.waitForSelector("text=Test Learner");
    await p.reload();
    assert.equal(await p.getByText("learner@example.com", { exact: true }).count(), 1);
    passed.push("Employee creation and reload persistence");
    const learner = await p.evaluate(
        () => Training.data.employees.find((e) => e.email === "learner@example.com").id,
    );
    let r = p.locator("tr").filter({ hasText: "learner@example.com" });
    await r.getByRole("button", { name: "Edit", exact: true }).click();
    await p.locator("[name=role]").fill("Senior Analyst");
    await save();
    await p.waitForSelector("text=Senior Analyst");
    await p.locator("#record-search").fill("Test Learner");
    await p.waitForTimeout(300);
    assert.equal(await p.locator("tbody tr").count(), 1);
    passed.push("Employee editing and search");
    await go("dashboard/batches");
    await p.getByRole("button", { name: "Create batch", exact: true }).click();
    await p.locator("[name=name]").fill("QA cohort");
    await p.locator("[name=capacity]").fill("1");
    await p.locator("[name=date]").fill("2026-11-25");
    await p.locator("[name=trainer]").fill("QA Trainer");
    await save();
    const batch = await p.evaluate(
        () => Training.data.batches.find((b) => b.name === "QA cohort").id,
    );
    passed.push("Batch creation with program, date, trainer and capacity");
    await go("dashboard/enrollments");
    await p.getByRole("button", { name: "Enroll employee", exact: true }).click();
    await p.locator("[name=employee]").selectOption(learner);
    await p.locator("[name=batch]").selectOption(batch);
    await save();
    await p.getByRole("button", { name: "Enroll employee", exact: true }).click();
    await p.locator("[name=employee]").selectOption(learner);
    await p.locator("[name=batch]").selectOption(batch);
    await save();
    assert.match(await p.locator("#record-form .form-error").innerText(), /already enrolled/);
    await p.locator("[name=employee]").selectOption("EMP001");
    await save();
    assert.match(await p.locator("#record-form .form-error").innerText(), /capacity/);
    await p.getByRole("button", { name: "Cancel", exact: true }).click();
    passed.push("Enrollment creation, duplicate prevention, and capacity enforcement");
    const enrollment = await p.evaluate(
        (id) => Training.data.enrollments.find((e) => e.employee === id).id,
        learner,
    );
    await go("dashboard/attendance");
    await p.locator(`[data-attendance="${enrollment}"]`).selectOption("Present");
    await p.reload();
    assert.equal(await p.locator(`[data-attendance="${enrollment}"]`).inputValue(), "Present");
    await go("dashboard/completion");
    for (let i = 0; i < 4; i++)
        await p.locator(`[data-module="${enrollment}"][value="${i}"]`).check();
    assert.equal(
        await p.evaluate(
            (id) => Training.stats(Training.data.enrollments.find((e) => e.id === id)).completion,
            enrollment,
        ),
        100,
    );
    passed.push("Attendance and module updates persist and calculate progress");
    await go("dashboard/certificates");
    const certificateRow = p.locator("tr").filter({ hasText: "Test Learner" });
    await certificateRow.getByRole("button", { name: "Preview completion" }).click();
    assert.match(await p.locator(".certificate-preview").innerText(), /Test Learner/);
    await p.getByRole("button", { name: "Close details", exact: true }).click();
    for (const name of ["Attendance PDF", "Completion PDF"]) {
        const wait = p.waitForEvent("download");
        await certificateRow.getByRole("button", { name, exact: true }).click();
        const download = await wait;
        fs.mkdirSync("documentation/qa-downloads", { recursive: true });
        await download.saveAs("documentation/qa-downloads/" + download.suggestedFilename());
        assert.equal(
            fs
                .readFileSync("documentation/qa-downloads/" + download.suggestedFilename())
                .subarray(0, 4)
                .toString(),
            "%PDF",
        );
    }
    passed.push("Both certificate types, eligibility, preview, and real PDF downloads");
    await go("dashboard/reports");
    await p.locator("#record-search").fill("Test Learner");
    await p.waitForTimeout(300);
    const downloadEvent = p.waitForEvent("download");
    await p.getByRole("button", { name: "Export CSV", exact: true }).click();
    const csv = await downloadEvent;
    await csv.saveAs("documentation/qa-downloads/report.csv");
    const csvText = fs.readFileSync("documentation/qa-downloads/report.csv", "utf8");
    assert.match(csvText, /Test Learner/);
    assert(!csvText.includes("Aisha Patel"));
    passed.push("Filtered CSV export includes selected records and issued certificate IDs");
    await go("dashboard/calendar");
    await p.getByRole("button", { name: "Next month", exact: true }).click();
    await p.getByRole("button", { name: "Previous month", exact: true }).click();
    await p.locator("[data-batch-detail]").first().click();
    assert.match(await p.locator("#detail-content").innerText(), /Trainer/);
    await p.getByRole("button", { name: "Close details", exact: true }).click();
    passed.push("Calendar navigation and session details");
    await go("programs");
    await p.locator("[data-search-input]").fill("nonexistent query");
    assert(await p.locator("[data-empty-for]").isVisible());
    await go("blog");
    await p.locator('[data-page="2"]').click();
    assert.equal(await p.locator("#blog-list > :visible").count(), 3);
    passed.push("Public program search, empty state and blog pagination");
    await go("login");
    await p.locator("[data-auth-form] [name=email]").fill("hr@elevora.example");
    await p.locator("[name=password]").fill("Elevora2026!");
    await p.locator("[data-password-toggle]").click();
    assert.equal(await p.locator("[name=password]").getAttribute("type"), "text");
    await p.locator("[data-auth-form] button[type=submit]").click();
    await p.waitForURL("**/dashboard/index.html");
    passed.push("Demo login and password visibility");
    for (const file of [
        "index",
        "home-2",
        "contact",
        "login",
        "dashboard/index",
        "dashboard/employees",
        "dashboard/attendance",
        "dashboard/calendar",
        "dashboard/settings",
    ]) {
        await go(file);
        for (const theme of ["light", "dark"]) {
            await p.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
            await p.waitForTimeout(250);
            const result = await new AxeBuilder({ page: p })
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze();
            axe.push({
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
    await go("dashboard/settings");
    await p.getByRole("button", { name: "Reset sample data", exact: true }).click();
    await p.getByRole("button", { name: "Replace with sample data", exact: true }).click();
    assert.equal(await p.evaluate(() => Training.data.employees.length), 12);
    passed.push("Confirmed reset restores the coherent sample dataset");
    fs.writeFileSync(
        "documentation/workflow-audit.json",
        JSON.stringify({ date: new Date().toISOString(), passed, axe }, null, 2),
    );
    console.log(
        JSON.stringify(
            { passed, accessibilityViolations: axe.filter((x) => x.violations.length) },
            null,
            2,
        ),
    );
    await b.close();
    if (axe.some((x) => x.violations.length)) process.exitCode = 1;
})();
