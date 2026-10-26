# Page structure

| Public page | Main sections |
| --- | ---: |
| index.html — workforce learning homepage | 10 |
| home-2.html — executive learning homepage | 10 |
| about.html | 6 |
| programs.html | 6 |
| program-details.html | 6 |
| methodology.html | 6 |
| clients.html | 6 |
| customized-training.html | 6 |
| blog.html | 5 |
| contact.html | 5 |

Login, register, forgot-password, privacy, terms, 404, and coming-soon use layouts suited to their purpose. All 19 public files live under `pages/`.

The 14 pages in `pages/dashboard/` are overview (`index.html`), employees, departments, programs, batches, enrollments, attendance, completion, certificates, calendar, reports, notifications, profile, and settings. Their shared shell is pre-rendered; their view is rendered from the same data store by `dashboard.js`.

`assets/css` contains semantic design, reusable states, responsive overrides, dark mode, RTL, and dashboard styles. `assets/js` separates theme/navigation/forms/public filters from the data store, charts, calendar, PDF generation, and dashboard controllers. `assets/images` contains 24 distinctly named WebP images and `branding/` SVGs. `assets/vendor` contains the local dependencies and upstream licenses.

`scripts/build.cjs` is the content source and build-time component system. `scripts/format.cjs` formats first-party code. `scripts/serve.cjs` is a local preview server. `tests/` contains repeatable static, responsive, workflow, accessibility, and reference-review checks. `documentation/` includes instructions and generated evidence; it need not be deployed.
