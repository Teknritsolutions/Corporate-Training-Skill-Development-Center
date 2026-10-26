const { chromium } = require("playwright");
const path = require("path");
(async () => {
    const b = await chromium.launch({
        executablePath: path.join(
            process.env.LOCALAPPDATA,
            "ms-playwright/chromium-1248/chrome-win64/chrome.exe",
        ),
    });
    const p = await b.newPage();
    for (const name of ["attendance", "index", "reports"])
        for (const width of [320, 1024]) {
            await p.setViewportSize({ width, height: 900 });
            await p.goto("http://127.0.0.1:4173/pages/dashboard/" + name + ".html");
            console.log(
                name,
                width,
                await p.evaluate(() =>
                    [...document.querySelectorAll("body *")]
                        .filter((e) => {
                            const r = e.getBoundingClientRect();
                            return (
                                r.right > innerWidth + 1 &&
                                r.width &&
                                getComputedStyle(e).position !== "fixed"
                            );
                        })
                        .slice(0, 12)
                        .map((e) => ({
                            tag: e.tagName,
                            cls: e.className,
                            w: e.getBoundingClientRect().width,
                            right: e.getBoundingClientRect().right,
                        })),
                ),
            );
        }
    await b.close();
})();
