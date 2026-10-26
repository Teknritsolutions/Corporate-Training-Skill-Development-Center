# QA report

Latest responsive run: 2026-10-22T16:02:15.918Z. Latest workflow run: 2026-10-22T15:44:43.766Z.

## Executed checks

- Static audit: 33 pages, local links/assets, one H1 per page, exactly ten sections in each homepage, unique photo references, and encoding.
- Chromium responsive audit: 1716 checks across 33 pages, 13 widths (320, 360, 375, 390, 420, 480, 640, 768, 820, 1024, 1280, 1440, 1920), two themes, and both text directions.
- JavaScript errors observed: 0. Responsive findings remaining: 0.
- Workflow checks: 11 passed.
- Axe WCAG 2 A/AA and 2.1 AA checks: 18 page/theme combinations. Combinations with reported violations: 0.

- Employee creation and reload persistence
- Employee editing and search
- Batch creation with program, date, trainer and capacity
- Enrollment creation, duplicate prevention, and capacity enforcement
- Attendance and module updates persist and calculate progress
- Both certificate types, eligibility, preview, and real PDF downloads
- Filtered CSV export includes selected records and issued certificate IDs
- Calendar navigation and session details
- Public program search, empty state and blog pagination
- Demo login and password visibility
- Confirmed reset restores the coherent sample dataset

## Evidence and limits

Machine-readable results are browser-audit.json and workflow-audit.json. Screenshots are under screenshots/. PDF and CSV test downloads are under qa-downloads/. Reference research has separate evidence. Accessibility automation is a foundation, not a complete WCAG conformance certification.

Chromium was tested on Windows. Safari, Firefox, assistive technology screen-reader sessions, real email delivery, production authentication, and server integrations were not tested. Lighthouse scores, field LCP/CLS/INP, and commercial review approval have not been measured or claimed. Sample content, example URLs, legal copy, and configuration must be replaced before launch.

## Expanded interaction and accessibility audit

Run: 2026-10-22T15:59:59.266Z. 8 additional interaction groups passed. All 33 pages were checked in both themes (66 combinations); combinations with reported violations: 0.

- Keyboard skip link, dropdown opening/escape, and cross-page theme/RTL persistence
- Public mobile menu and Escape at 320px
- Contact required fields, consent, validation and honest local success state
- Registration mismatch handling and no persisted password
- Mobile sidebar focus/inert handling and desktop collapse
- Settings threshold validation and persistence
- Deletion cancellation, confirmation and cascading data consistency
- Overview chart totals agree with shared records after deletion

Desktop and mobile dark/RTL screenshot contact sheets were visually reviewed for every page. Full screenshots of both homepages and the overview are included.

## Final focused check

The compact calendar/agenda was checked in 20 viewport/theme/direction states after visual refinement, with no overflow, no reported accessibility violations, and no browser console errors. Session details, program filtering, and formatted phone input validation passed. See calendar-final-audit.json.
