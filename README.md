# Stackly — Corporate Training & Skill Development

A complete static HTML template with two homepage designs, 17 additional public pages, and a 14-page HR/training workspace. The dashboard uses one versioned LocalStorage dataset. No account, deployment, or remote service is required to preview it.

## Open the website

From this folder, run:

```powershell
node scripts/serve.cjs
```

Open <http://127.0.0.1:4173/pages/index.html>. Home 2 is at `/pages/home-2.html`; the dashboard is at `/pages/dashboard/index.html`.

Demo login: **hr@stackly.example** / **Stackly2026!**. The login is a demonstration flow, not an access-control system. The dashboard can also be opened directly.

The generated HTML, CSS, scripts, vendor libraries, and 24 original WebP photos are already included. Node is only needed for the supplied preview server and development commands. Google Fonts requires an internet connection; system sans-serif fallbacks remain usable offline.

## Included

- Exactly 10 sections in each homepage; the requested 5–6 sections on major inner pages.
- Employee CRUD, departments, batches, seat limits, enrollments, attendance, and module progress.
- Five data-driven Chart.js charts, filtered reports, CSV export, and printing.
- Monthly training calendar with session details and program filtering.
- Configurable eligibility, attendance/completion certificates, and jsPDF downloads.
- Persistent light/dark and RTL controls, accessible native dialogs, responsive tables, and mobile navigation.
- Locally saved contact/proposal/newsletter demonstrations, blog filters/pagination, and authentication demonstrations.

## Development

```powershell
npm ci
node scripts/build.cjs
node scripts/format.cjs
node tests/audit.cjs
node tests/browser.cjs
node tests/workflows.cjs
```

Keep the preview server running during browser tests. Browser tests use the installed Chromium path when present; otherwise install the Playwright browser with `node node_modules/playwright/cli.js install chromium`. They create isolated browser contexts and do not touch your normal browser data.

Edit `scripts/build.cjs` for public content, shared headers/footers, and dashboard shells; run build and format afterward. Edit `assets/js/dashboard*.js`, `calendar.js`, and `certificates.js` for workspace behavior. Vendor files retain their upstream formatting and licenses.

## Documentation

- [Installation](documentation/installation.md)
- [Customization](documentation/customization.md)
- [Page structure](documentation/page-structure.md)
- [Dashboard guide](documentation/dashboard-guide.md)
- [Image credits](documentation/image-credits.md)
- [Licensing notes](documentation/licensing.md)
- [Design references](documentation/design-notes.md)
- [QA results](documentation/qa-report.md)
- [Changelog](documentation/changelog.md)

All companies, trainers, testimonials, outcomes, contact information, and prices are fictional samples. Forms save to this browser without sending messages. Replace sample branding, legal copy, metadata, and contact details before a public launch.
