# Dashboard guide

## Data and persistence

The `stackly-training-v1` LocalStorage record holds employees, departments, programs, batches, enrollments, attendance, completed modules, certificate records, notifications, profile, and settings. All records are fictional. Every view reads this single source. Browser profiles/origins do not share data. Reset requires an explicit confirmation and replaces the workspace with the sample dataset.

The sample contains 12 employees, five departments, four programs, six batches, and 12 enrollments. Historical October sessions have sample attendance; November batches demonstrate upcoming calendar sessions. Some records deliberately have incomplete or unrecorded progress.

## Daily workflows

1. Add a department if needed, then add employees with unique email addresses. Search/filter the directory, open Details, or edit a record. Deletion asks for confirmation and removes linked enrollments/certificates.
2. Create a batch with a program, trainer, date/time, capacity, and location. Capacity cannot be reduced below existing enrollments. An enrolled batch cannot switch programs because its module history belongs to that program. Create another batch instead.
3. Enroll an active employee in a batch. The batch choice displays its program/name and occupancy. Duplicate employee/batch pairs and over-capacity enrollments are rejected with an inline error. Removing an enrollment frees its seat.
4. On Attendance, select a batch and session date. Changes save immediately. Blank means unrecorded. Present and Late count toward attendance; Absent and Excused do not. Attendance equals counted records divided by all recorded statuses. A learner with no recorded statuses has 0%, not an assumed presence. CSV export includes the selected date/status.
5. On Module completion, check completed modules. Progress equals completed modules divided by program modules. Progress bars and reports update from those records.
6. On Certificates, attendance PDFs require the configured attendance minimum. Completion PDFs require both attendance and module minimums. Settings defaults are 80% attendance and 100% modules. Completion previews remain readable in both themes. Each type receives a unique demo ID and issuance date, and repeated downloads retain the same ID. PDFs include training date, organization, learner, program, certificate type, and signatory placeholder.

## Calendar, reports, and charts

Navigate months in the calendar, filter by program, and select an event for its trainer, date/time, location, and occupancy. Event labels show available places. The overview lists upcoming sessions in date order.

Reports combines enrollment, attendance, completion, and certificate information in one table. Filter by enrollment date range, department, program, batch, learning status, or text. CSV export uses the filtered records and includes issued certificate IDs. Print hides navigation and controls. Attendance also has its own date-specific export and print control.

Five charts summarize the same records: monthly enrollments, current completion of enrollment-month cohorts, attendance distribution, department enrollment counts, and average program completion. The completion line describes current progress grouped by enrollment month; it is not fabricated historical completion events. The attendance donut combines recorded Present/Late, recorded Absent/Excused, and learners with no records, as labeled. Counts and percentage tooltips are accompanied by text summaries. Report chart filters apply to the report's current enrollment subset.

The overview KPIs show total employees, incomplete/active enrollments, fully completed enrollment rate, average learner attendance, future/today sessions, and issued certificate records. Values are derived rather than separately hardcoded.

## Demonstration boundaries

Login uses sample credentials only. Remember me stores a demo-session marker, not a password; logout removes that marker. Registration stores a demo profile without persisting passwords. Recovery explains how to use sample access and sends no email. Dashboard access is intentionally not secured by a client-side redirect.

Notifications can be marked read/unread. Profile and workspace settings persist locally. This template has no server, email delivery, real credential verification, payment processing, or multi-user synchronization. Use synthetic records only until a proper backend is integrated.
