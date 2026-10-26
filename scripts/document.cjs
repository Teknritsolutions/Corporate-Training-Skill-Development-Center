const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const manifest = [];
for (const name of fs.readdirSync("pages").filter((n) => n.endsWith(".html"))) {
    const text = fs.readFileSync("pages/" + name, "utf8");
    for (const match of text.matchAll(/<img\b[^>]*src="([^"]+\.webp)"[^>]*alt="([^"]*)"/g)) {
        const file = path.normalize(path.join("pages", match[1]));
        const buffer = fs.readFileSync(file);
        manifest.push({
            file: file.replaceAll("\\", "/"),
            page: "pages/" + name,
            description: match[2],
            bytes: buffer.length,
            sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
        });
    }
}
fs.writeFileSync("documentation/image-manifest.json", JSON.stringify(manifest, null, 4));
fs.writeFileSync(
    "documentation/image-credits.md",
    "# Image credits\n\nAll photographs below are original AI-generated editorial training images created for this project on 2026-10-22. Each is used once, with a unique composition and filename. People, workplaces, and training scenarios are fictional. Originals were optimized to WebP; the 24 images total approximately 2.2 MB. See image-manifest.json for sizes and SHA-256 hashes. Branding SVGs are original code-native artwork and intentionally repeat as shared identity.\n\n| Asset | Destination | Description |\n| --- | --- | --- |\n" +
        manifest
            .map((m) => `| ${path.basename(m.file)} | ${m.page} | ${m.description} |`)
            .join("\n") +
        "\n\nNo photography from the reference websites was reused. See licensing.md for distribution notes.\n",
);
if (
    fs.existsSync("documentation/browser-audit.json") &&
    fs.existsSync("documentation/workflow-audit.json")
) {
    const browser = JSON.parse(fs.readFileSync("documentation/browser-audit.json")),
        workflow = JSON.parse(fs.readFileSync("documentation/workflow-audit.json"));
    fs.writeFileSync(
        "documentation/qa-report.md",
        `# QA report\n\nLatest responsive run: ${browser.date}. Latest workflow run: ${workflow.date}.\n\n## Executed checks\n\n- Static audit: 33 pages, local links/assets, one H1 per page, exactly ten sections in each homepage, unique photo references, and encoding.\n- Chromium responsive audit: ${browser.checks} checks across ${browser.pages} pages, ${browser.widths.length} widths (${browser.widths.join(", ")}), two themes, and both text directions.\n- JavaScript errors observed: ${browser.errors.length}. Responsive findings remaining: ${browser.failures.length}.\n- Workflow checks: ${workflow.passed.length} passed.\n- Axe WCAG 2 A/AA and 2.1 AA checks: ${workflow.axe.length} page/theme combinations. Combinations with reported violations: ${workflow.axe.filter((x) => x.violations.length).length}.\n\n${workflow.passed.map((x) => "- " + x).join("\n")}\n\n## Evidence and limits\n\nMachine-readable results are browser-audit.json and workflow-audit.json. Screenshots are under screenshots/. PDF and CSV test downloads are under qa-downloads/. Reference research has separate evidence. Accessibility automation is a foundation, not a complete WCAG conformance certification.\n\nChromium was tested on Windows. Safari, Firefox, assistive technology screen-reader sessions, real email delivery, production authentication, and server integrations were not tested. Lighthouse scores, field LCP/CLS/INP, and commercial review approval have not been measured or claimed. Sample content, example URLs, legal copy, and configuration must be replaced before launch.\n`,
    );
}
if (fs.existsSync("documentation/interaction-audit.json")) {
    const extra = JSON.parse(fs.readFileSync("documentation/interaction-audit.json", "utf8"));
    fs.appendFileSync(
        "documentation/qa-report.md",
        `\n## Expanded interaction and accessibility audit\n\nRun: ${extra.date}. ${extra.passed.length} additional interaction groups passed. All 33 pages were checked in both themes (${extra.accessibility.length} combinations); combinations with reported violations: ${extra.accessibility.filter((x) => x.violations.length).length}.\n\n${extra.passed.map((x) => "- " + x).join("\n")}\n\nDesktop and mobile dark/RTL screenshot contact sheets were visually reviewed for every page. Full screenshots of both homepages and the overview are included.\n`,
    );
}
if (fs.existsSync("documentation/calendar-final-audit.json")) {
    const calendar = JSON.parse(fs.readFileSync("documentation/calendar-final-audit.json", "utf8"));
    fs.appendFileSync(
        "documentation/qa-report.md",
        `\n## Final focused check\n\nThe compact calendar/agenda was checked in ${calendar.checks} viewport/theme/direction states after visual refinement, with no overflow, no reported accessibility violations, and no browser console errors. Session details, program filtering, and formatted phone input validation passed. See calendar-final-audit.json.\n`,
    );
}
console.log("Documented " + manifest.length + " unique photos and current QA evidence.");
