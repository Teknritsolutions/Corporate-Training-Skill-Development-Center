# Installation

The distributable website is the `pages` and `assets` folders, plus the root index, favicon, robots file, and sitemap. Preserve relative paths. Serve the root folder through an HTTP server; opening `file://` pages can give inconsistent storage and download behavior between browsers.

Run `node scripts/serve.cjs`, then visit `http://127.0.0.1:4173`. The server binds only to your computer on port 4173. Stop it with Ctrl+C. Change the port in `scripts/serve.cjs` if it is occupied.

The site runs with the bundled Bootstrap 5.3.3 CSS, Bootstrap Icons 1.11.3, Chart.js 4.4.8, and jsPDF 3.0.1. Bootstrap JavaScript is unnecessary: small native JavaScript modules implement the interactions. Google Fonts supplies Plus Jakarta Sans and Inter. To host fonts locally, download the licensed fonts, retain their license, define `@font-face`, and replace the import in `style.css`.

Node.js and npm are development tools, not production requirements. `npm ci` installs the pinned development dependencies. `node scripts/build.cjs` regenerates pages and vendor copies; `node scripts/format.cjs` restores readable formatting. Existing pages can be deployed as static files without running a build.

For static hosting, configure your host's missing-page route to `pages/404.html`. The supplied preview server returns an HTTP 404 for missing files; it does not pretend a missing page exists. Set actual canonical and sitemap URLs before deployment. No hosting, publishing, or account connection was performed as part of this build.
