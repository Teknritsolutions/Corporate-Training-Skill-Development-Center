# Customization

## Branding and design

Change semantic tokens at the top of `assets/css/style.css`; dark theme overrides live in `dark-mode.css`. Navy anchors the brand, teal highlights actions, blue supports data, and gold accents certificates. Typography uses restrained responsive headings and consistent body sizes. The main container is 1200px; section spacing is 88px on desktop and scales down on mobile.

`components.css` holds shared interaction states, `responsive.css` handles public breakpoints, `dashboard.css` handles the workspace, and `rtl.css` handles directional exceptions. Use logical margin/padding/inset properties. Do not hide body overflow to conceal layout faults. Wide tables intentionally scroll inside their own regions.

Update the SVG mark, light/dark logos, favicon SVG, and root ICO together. The shared brand helper in `scripts/build.cjs` supplies the wordmark. Navigation and footer content are build-time components, so each generated page contains full semantic markup without a runtime header fetch.

## Content and images

Edit page content in `scripts/build.cjs`, then rebuild and format. Program IDs are stable allowlisted keys (`communication`, `leadership`, `sales`, `technical`). Program detail URLs use `?program=leadership`; article URLs use `?article=manager`. Unknown keys fall back to a safe default. Public detail text is assigned with textContent or generated from trusted constants.

Each original photo is used in one section on one HTML page. Image credits list the destinations. Replacing a photo should preserve meaningful alt text, intrinsic width/height, the intended crop, and compression. The hero loads eagerly; below-fold images are lazy-loaded. Do not reuse the same replacement photo on multiple pages.

Edit public program definitions in the build script and dashboard definitions in `dashboard-data.js` together. The supplied IDs, names, and module counts agree. Changes to sample data affect a fresh/reset workspace. Use Settings → Reset sample data to replace an already saved dataset after changing seeds.

## Theme and RTL

`theme.js` applies preferences before styles paint. Without an explicit preference it follows the system theme. The controls save `stackly-theme` and `stackly-direction`. Remove those keys to return to defaults. Set `dir="rtl"` to enable layout support; use real translated copy and `lang="ar"` or `lang="he"` for a localized release. RTL layout alone is not a translation.

## Production integrations

Replace demo form handlers in `forms.js` with validated server endpoints and real delivery feedback. Implement server authentication, authorization, password hashing, account recovery, secure sessions, protected storage, audit logs, and a database before storing real employee records. LocalStorage is editable, browser-specific, and not a security boundary. Never place secrets in these files.

Replace fictional company names, sample outcomes/testimonials, trainer bios, prices, social destinations, contact details, and map integration placeholder. Add your actual privacy notice and terms. Update canonical URLs, Open Graph URLs/images, JSON-LD, robots.txt, and sitemap.xml. Production dashboard and authentication routes should remain excluded from indexing and protected on the server.

jsPDF's bundled standard fonts are suited to Latin text. Embed an appropriately licensed Unicode font before issuing certificates in other scripts. Certificates are demonstration documents, not independently verified credentials. Review branding and legal wording for your organization.
