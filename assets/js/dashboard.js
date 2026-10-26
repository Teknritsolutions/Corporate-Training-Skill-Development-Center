(() => {
    const T = Training,
        view = document.getElementById("dashboard-view"),
        page = document.body.dataset.dashboard;
    if (page === "reports") window.chartEnrollmentFilter = () => filteredEnrollments();
    const esc = (window.escapeHTML = (s) =>
        String(s ?? "").replace(
            /[&<>"']/g,
            (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
        ));
    const option = (values, selected = "") =>
        values
            .map((x) => {
                const [v, l] = Array.isArray(x) ? x : [x, x];
                return `<option value="${esc(v)}" ${v === selected ? "selected" : ""}>${esc(l)}</option>`;
            })
            .join("");
    const field = (name, label, value = "", type = "text", choices = null) =>
        `<label class="field">${label}${choices ? `<select name="${name}" required>${option(choices, value)}</select>` : `<input name="${name}" type="${type}" value="${esc(value)}" required ${type === "number" ? 'min="1" max="1000"' : ""}>`}</label>`;
    const button = (text, action, id = "", cls = "btn btn-outline") =>
        `<button type="button" class="${cls}" data-action="${action}" data-id="${esc(id)}">${text}</button>`;
    const panel = (title, body, actions = "") =>
        `<section class="workspace-panel"><div class="panel-heading"><h2>${title}</h2><div class="actions">${actions}</div></div>${body}</section>`;
    const table = (heads, rows) =>
        `<div class="table-responsive"><table class="data-table"><thead><tr>${heads.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.join("") : `<tr><td colspan="${heads.length}"><div class="empty-state">No matching records. Adjust your filters or add a record.</div></td></tr>`}</tbody></table></div>`;
    const row = (cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    const badge = (s) => `<span class="status">${esc(s)}</span>`;
    const actions = (type, id) =>
        `<div class="row-actions">${button("Details", "details-" + type, id)}${button("Edit", "edit-" + type, id)}${button("Delete", "delete-" + type, id)}</div>`;
    let search = "",
        department = "",
        programFilter = "",
        batchFilter = "",
        statusFilter = "",
        from = "",
        to = "",
        attendanceDate = new Date().toISOString().slice(0, 10),
        cal = new Date(2026, 10, 1);
    function filters(extra = "") {
        return `<div class="filters"><label class="field">Search<input type="search" id="record-search" value="${esc(search)}" placeholder="Search records"></label>${extra}</div>`;
    }
    const selectFilter = (id, label, values, value) =>
        `<label class="field">${label}<select id="${id}"><option value="">All ${label.toLowerCase()}</option>${option(values, value)}</select></label>`;
    function filteredEnrollments() {
        return T.data.enrollments.filter((e) => {
            const person = T.employee(e.employee),
                b = T.batch(e.batch),
                s = T.stats(e);
            return (
                (!department || person?.department === department) &&
                (!programFilter || b?.program === programFilter) &&
                (!batchFilter || e.batch === batchFilter) &&
                (!from || e.date >= from) &&
                (!to || e.date <= to) &&
                (!statusFilter ||
                    (statusFilter === "Completed"
                        ? s.completion === 100
                        : statusFilter === "In progress"
                          ? s.completion > 0 && s.completion < 100
                          : s.completion === 0)) &&
                (!search ||
                    [person?.name, b?.name, e.id]
                        .join(" ")
                        .toLowerCase()
                        .includes(search.toLowerCase()))
            );
        });
    }
    function enrollmentRows(es, mode) {
        return es.map((e) => {
            const person = T.employee(e.employee),
                b = T.batch(e.batch),
                s = T.stats(e);
            const base = [esc(person?.name), esc(b?.name)];
            if (mode === "attendance")
                return row([
                    ...base,
                    `<label class="sr-only" for="attendance-${e.id}">Attendance for ${esc(person?.name)}</label><select id="attendance-${e.id}" data-attendance="${e.id}" class="form-select"><option value="">Not recorded</option>${option(["Present", "Late", "Absent", "Excused"], e.attendance[attendanceDate])}</select>`,
                    s.attendance + "%",
                ]);
            if (mode === "completion") {
                const p = T.program(b.program);
                return row([
                    ...base,
                    `<div class="module-checks">${Array.from({ length: p.modules }, (_, i) => `<label><input type="checkbox" data-module="${e.id}" value="${i}" ${e.modules.includes(i) ? "checked" : ""}> Module ${i + 1}</label>`).join("")}</div>`,
                    `<progress max="100" value="${s.completion}" aria-label="Module completion"></progress>${s.completion}%`,
                ]);
            }
            if (mode === "reports")
                return row([
                    esc(e.id),
                    ...base,
                    esc(person?.department),
                    esc(e.date),
                    badge(
                        s.completion === 100
                            ? "Completed"
                            : s.completion
                              ? "In progress"
                              : "Not started",
                    ),
                    s.attendance + "%",
                    s.completion + "%",
                    T.data.certificates
                        .filter((c) => c.enrollment === e.id)
                        .map((c) => esc(c.id))
                        .join(", ") || "Not issued",
                ]);
            if (mode === "certificates")
                return row([
                    ...base,
                    s.attendance + "%",
                    s.completion + "%",
                    `<div class="actions">${s.attendance >= T.data.settings.attendance ? button("Attendance PDF", "attendance-certificate", e.id) : badge("Attendance pending")}${T.eligible(e) ? button("Preview completion", "preview-certificate", e.id) + button("Completion PDF", "certificate", e.id) : badge("Completion pending")}</div>`,
                ]);
            return row([
                esc(e.id),
                ...base,
                esc(person?.department),
                esc(e.date),
                badge(
                    s.completion === 100
                        ? "Completed"
                        : s.completion
                          ? "In progress"
                          : "Not started",
                ),
                button("Remove", "delete-enrollment", e.id),
            ]);
        });
    }
    function charts() {
        return `<div class="chart-grid">${[
            ["enrollment", "Monthly enrollments"],
            ["department", "Department training"],
            ["completion", "Completion by enrollment month (%)"],
            ["attendance", "Attendance distribution"],
            ["status", "Program category performance (%)"],
        ]
            .map(([id, title]) =>
                panel(
                    title,
                    `<div class="chart-wrap"><canvas id="${id}-chart" role="img" aria-label="${title}. Equivalent records are available in the training reports."></canvas></div>`,
                ),
            )
            .join("")}</div>`;
    }
    function render() {
        const d = T.data;
        let content = "";
        if (page === "index") {
            content = `<div class="dashboard-banner"><div><span class="eyebrow">BUILD CAPABILITY. MEASURE PROGRESS.</span><h2>Make every learning moment count.</h2><p>Your next cohort starts with a clear plan.</p></div><a class="btn btn-white" href="enrollments.html">Manage enrollments →</a></div><div class="kpi-grid">${[
                ["Total employees", d.employees.length],
                [
                    "Active enrollments",
                    d.enrollments.filter((e) => T.stats(e).completion < 100).length,
                ],
                [
                    "Training completion rate",
                    (d.enrollments.length
                        ? Math.round(
                              (d.enrollments.filter((e) => T.stats(e).completion === 100).length /
                                  d.enrollments.length) *
                                  100,
                          )
                        : 0) + "%",
                ],
                [
                    "Average attendance",
                    (d.enrollments.length
                        ? Math.round(
                              d.enrollments.reduce((n, e) => n + T.stats(e).attendance, 0) /
                                  d.enrollments.length,
                          )
                        : 0) + "%",
                ],
                [
                    "Upcoming sessions",
                    d.batches.filter((b) => b.date >= new Date().toISOString().slice(0, 10)).length,
                ],
                ["Certificates issued", d.certificates.length],
            ]
                .map(
                    ([l, n]) =>
                        `<article class="kpi"><p>${l}</p><strong>${n}</strong><span>From your current workspace records</span></article>`,
                )
                .join("")}</div>${charts()}${panel(
                "Upcoming training",
                table(
                    ["Session", "Date", "Trainer", "Capacity"],
                    d.batches
                        .filter((b) => b.date >= new Date().toISOString().slice(0, 10))
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map((b) =>
                            row([
                                esc(b.name),
                                esc(b.date),
                                esc(b.trainer),
                                `${d.enrollments.filter((e) => e.batch === b.id).length} / ${b.capacity}`,
                            ]),
                        ),
                ),
                '<a href="calendar.html">View calendar →</a>',
            )}`;
        } else if (page === "employees") {
            const es = d.employees.filter(
                (e) =>
                    (!department || e.department === department) &&
                    [e.name, e.email, e.id].join(" ").toLowerCase().includes(search.toLowerCase()),
            );
            content = panel(
                "Employee directory",
                filters(
                    selectFilter("department-filter", "Department", d.departments, department),
                ) +
                    table(
                        ["Employee ID", "Name / email", "Department", "Role", "Status", "Actions"],
                        es.map((e) =>
                            row([
                                esc(e.id),
                                `<strong>${esc(e.name)}</strong><br><small>${esc(e.email)}</small>`,
                                esc(e.department),
                                esc(e.role),
                                badge(e.status),
                                actions("employee", e.id),
                            ]),
                        ),
                    ),
                button("Add employee", "add-employee", "", "btn btn-primary"),
            );
        } else if (page === "departments")
            content = panel(
                "Departments",
                table(
                    ["Department", "Employees", "Enrollments"],
                    d.departments.map((n) =>
                        row([
                            esc(n),
                            d.employees.filter((e) => e.department === n).length,
                            d.enrollments.filter((e) => T.employee(e.employee)?.department === n)
                                .length,
                        ]),
                    ),
                ),
                button("Add department", "add-department", "", "btn btn-primary"),
            );
        else if (page === "programs")
            content = panel(
                "Training catalog",
                `<div class="grid cols-2">${d.programs.map((p) => `<article class="card"><div class="card-body"><span class="eyebrow">${p.modules} LEARNING MODULES</span><h3>${esc(p.name)}</h3><p>Applied learning with attendance, module milestones, and completion certificates.</p><div class="actions"><a href="../${({ communication: "communication-skills", leadership: "leadership-development", sales: "sales-excellence", technical: "technical-upskilling" })[p.id]}.html" class="btn btn-outline">Program details</a><a href="batches.html" class="btn btn-primary">View batches</a></div></div></article>`).join("")}</div>`,
            );
        else if (page === "batches")
            content = panel(
                "Training batches",
                filters() +
                    table(
                        ["Batch", "Program", "Date / time", "Trainer", "Places", "Actions"],
                        d.batches
                            .filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
                            .map((b) =>
                                row([
                                    esc(b.name),
                                    esc(T.program(b.program)?.name),
                                    `${esc(b.date)}<br>${esc(b.time)}`,
                                    esc(b.trainer),
                                    `${d.enrollments.filter((e) => e.batch === b.id).length} / ${b.capacity}`,
                                    actions("batch", b.id),
                                ]),
                            ),
                    ),
                button("Create batch", "add-batch", "", "btn btn-primary"),
            );
        else if (
            ["enrollments", "attendance", "completion", "certificates", "reports"].includes(page)
        ) {
            let extra =
                selectFilter("department-filter", "Department", d.departments, department) +
                selectFilter(
                    "program-filter",
                    "Program",
                    d.programs.map((p) => [p.id, p.name]),
                    programFilter,
                ) +
                selectFilter(
                    "batch-filter",
                    "Batch",
                    d.batches.map((b) => [b.id, b.name]),
                    batchFilter,
                );
            if (page === "attendance")
                extra += `<label class="field">Session date<input type="date" id="attendance-date" value="${attendanceDate}" required></label>`;
            if (page === "reports")
                extra +=
                    selectFilter(
                        "status-filter",
                        "Status",
                        ["Completed", "In progress", "Not started"],
                        statusFilter,
                    ) +
                    `<label class="field">From<input type="date" id="date-from" value="${from}"></label><label class="field">To<input type="date" id="date-to" value="${to}"></label>`;
            const heads =
                page === "attendance"
                    ? ["Employee", "Batch", "Status on selected date", "Overall attendance"]
                    : page === "completion"
                      ? ["Employee", "Batch", "Completed modules", "Progress"]
                      : page === "certificates"
                        ? ["Employee", "Program batch", "Attendance", "Completion", "Certificate"]
                        : page === "reports"
                          ? [
                                "Enrollment",
                                "Employee",
                                "Batch",
                                "Department",
                                "Enrolled",
                                "Progress",
                                "Attendance",
                                "Completion",
                                "Certificates",
                            ]
                          : [
                                "Enrollment",
                                "Employee",
                                "Batch",
                                "Department",
                                "Enrolled",
                                "Progress",
                                "Action",
                            ];
            content = panel(
                page === "reports"
                    ? "Filtered training records"
                    : page === "certificates"
                      ? "Completion certificates"
                      : "Learning records",
                `<p>${page === "certificates" ? `Eligibility: attendance ≥ ${d.settings.attendance}% and module completion ≥ ${d.settings.completion}%. PDF downloads are demonstration certificates.` : page === "attendance" ? "Changes save immediately for the selected session date. Present and Late count toward attendance; Absent and Excused do not." : page === "completion" ? "Check a module after a learner finishes it. Progress saves immediately." : "Records are stored locally in this browser."}</p>${filters(extra)}${table(heads, enrollmentRows(filteredEnrollments(), page))}`,
                page === "enrollments"
                    ? button("Enroll employee", "add-enrollment", "", "btn btn-primary")
                    : ["reports", "attendance"].includes(page)
                      ? button("Export CSV", "export") + button("Print report", "print")
                      : "",
            );
            if (page === "reports") content += charts();
        } else if (page === "calendar")
            content = panel(
                "Training calendar",
                selectFilter(
                    "calendar-program",
                    "Program",
                    d.programs.map((p) => [p.id, p.name]),
                    programFilter,
                ) + trainingCalendar(cal.getFullYear(), cal.getMonth(), programFilter),
            );
        else if (page === "notifications")
            content = panel(
                "Workspace updates",
                d.notifications
                    .map(
                        (n) =>
                            `<article class="notification"><span class="icon"><i class="bi bi-bell" aria-hidden="true"></i></span><div><h3>${esc(n.title)} ${n.read ? "" : '<span class="pill">New</span>'}</h3><p>${esc(n.text)}</p></div>${button(n.read ? "Mark unread" : "Mark read", "read", n.id)}</article>`,
                    )
                    .join(""),
                button("Mark all read", "read-all"),
            );
        else if (page === "profile")
            content = panel(
                "Your profile",
                `<form id="profile-form" class="form-grid">${field("name", "Full name", d.profile.name)}${field("email", "Email", d.profile.email, "email")}${field("role", "Job title", d.profile.role)}<div class="full"><button class="btn btn-primary">Save profile</button></div></form><p class="small muted">Profile information stays in this browser. This demo does not provide authentication or password management.</p>`,
            );
        else if (page === "settings")
            content = panel(
                "Workspace settings",
                `<form id="settings-form" class="form-grid">${field("company", "Company name", d.settings.company)}${field("attendance", "Minimum attendance (%)", d.settings.attendance, "number")}${field("completion", "Minimum completion (%)", d.settings.completion, "number")}<div class="full"><button class="btn btn-primary">Save settings</button></div></form><hr><h3>Demo data</h3><p>Reset replaces local training records with the original fictional sample dataset. Export a report first if you want to keep a copy.</p>${button("Reset sample data", "reset")}`,
            );
        view.innerHTML = content;
        renderTrainingCharts();
    }
    function toast(message) {
        const el = document.querySelector(".toast");
        el.textContent = message;
        el.hidden = false;
        clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => (el.hidden = true), 5000);
    }
    function detail(title, body) {
        document.getElementById("detail-title").textContent = title;
        document.getElementById("detail-content").innerHTML = body;
        document.getElementById("detail-dialog").showModal();
    }
    function openForm(type, id) {
        const d = T.data,
            edit = !!id;
        let fields = "",
            record = {};
        if (type === "employee") {
            record = d.employees.find((e) => e.id === id) || {};
            fields =
                field("name", "Full name", record.name) +
                field("email", "Work email", record.email, "email") +
                field("department", "Department", record.department, "text", d.departments) +
                field("role", "Role", record.role) +
                field("status", "Status", record.status || "Active", "text", [
                    "Active",
                    "Inactive",
                ]);
        }
        if (type === "batch") {
            record = d.batches.find((b) => b.id === id) || {};
            fields =
                field("name", "Batch name", record.name) +
                field(
                    "program",
                    "Program",
                    record.program,
                    "text",
                    d.programs.map((p) => [p.id, p.name]),
                ) +
                field("capacity", "Capacity", record.capacity || 12, "number") +
                field("date", "Start date", record.date, "date") +
                field("time", "Start time", record.time || "09:00", "time") +
                field("trainer", "Trainer", record.trainer) +
                field("location", "Location", record.location || "Virtual classroom");
        }
        if (type === "department") fields = field("name", "Department name");
        if (type === "enrollment")
            fields =
                field(
                    "employee",
                    "Employee",
                    "",
                    "text",
                    d.employees.filter((e) => e.status === "Active").map((e) => [e.id, e.name]),
                ) +
                field(
                    "batch",
                    "Batch",
                    "",
                    "text",
                    d.batches.map((b) => [
                        b.id,
                        `${b.name} (${d.enrollments.filter((e) => e.batch === b.id).length}/${b.capacity})`,
                    ]),
                );
        document.getElementById("dialog-title").textContent = (edit ? "Edit " : "Add ") + type;
        const form = document.getElementById("record-form");
        form.dataset.type = type;
        form.dataset.id = id || "";
        form.innerHTML =
            fields +
            '<p class="form-error full" role="alert" hidden></p><div class="full actions"><button class="btn btn-primary">Save ' +
            type +
            '</button><button class="btn btn-outline" type="button" data-close-dialog>Cancel</button></div>';
        document.getElementById("record-dialog").showModal();
    }
    document.addEventListener("submit", (ev) => {
        if (!["record-form", "profile-form", "settings-form"].includes(ev.target.id)) return;
        ev.preventDefault();
        const f = ev.target,
            v = Object.fromEntries(new FormData(f)),
            d = T.data;
        try {
            if (f.id === "profile-form") d.profile = v;
            else if (f.id === "settings-form") {
                if (+v.attendance > 100 || +v.completion > 100)
                    throw Error("Thresholds must be between 1 and 100.");
                d.settings = {
                    company: v.company.trim(),
                    attendance: +v.attendance,
                    completion: +v.completion,
                };
            } else {
                const type = f.dataset.type,
                    id = f.dataset.id;
                if (type === "employee") {
                    v.name = v.name.trim();
                    v.email = v.email.trim().toLowerCase();
                    if (!v.name || d.employees.some((e) => e.email === v.email && e.id !== id))
                        throw Error("Use a name and a unique employee email.");
                    const rec = { ...v, id: id || "EMP" + Date.now() };
                    if (id) Object.assign(T.employee(id), rec);
                    else d.employees.push(rec);
                }
                if (type === "batch") {
                    v.capacity = +v.capacity;
                    if (v.capacity < d.enrollments.filter((e) => e.batch === id).length)
                        throw Error("Capacity cannot be below the current enrollment count.");
                    if (
                        id &&
                        T.batch(id).program !== v.program &&
                        d.enrollments.some((e) => e.batch === id)
                    )
                        throw Error(
                            "An enrolled batch cannot change its program. Create a new batch instead.",
                        );
                    const rec = { ...v, id: id || "BAT" + Date.now() };
                    if (id) Object.assign(T.batch(id), rec);
                    else d.batches.push(rec);
                }
                if (type === "department") {
                    const name = v.name.trim();
                    if (!name || d.departments.some((n) => n.toLowerCase() === name.toLowerCase()))
                        throw Error("Enter a unique department name.");
                    d.departments.push(name);
                }
                if (type === "enrollment") T.enroll(v.employee, v.batch);
                document.getElementById("record-dialog").close();
            }
            T.save();
            render();
            toast("Changes saved in this browser.");
        } catch (e) {
            const error = f.querySelector(".form-error");
            if (error) {
                error.hidden = false;
                error.textContent = e.message;
            } else toast(e.message);
        }
    });
    document.addEventListener("click", (ev) => {
        const close = ev.target.closest("[data-close-dialog]");
        if (close) {
            close.closest("dialog").close();
            return;
        }
        const month = ev.target.closest("[data-month]");
        if (month) {
            cal =
                month.dataset.month === "today"
                    ? new Date()
                    : new Date(cal.getFullYear(), cal.getMonth() + Number(month.dataset.month), 1);
            render();
            return;
        }
        const batchButton = ev.target.closest("[data-batch-detail]");
        if (batchButton) {
            const b = T.batch(batchButton.dataset.batchDetail);
            detail(
                b.name,
                `<dl><dt>Trainer</dt><dd>${esc(b.trainer)}</dd><dt>Date & time</dt><dd>${esc(b.date)} · ${esc(b.time)}</dd><dt>Location</dt><dd>${esc(b.location)}</dd><dt>Capacity</dt><dd>${T.data.enrollments.filter((e) => e.batch === b.id).length} / ${b.capacity}</dd></dl><a class="btn btn-primary" href="enrollments.html">Manage enrollments</a>`,
            );
            return;
        }
        const target = ev.target.closest("[data-action]");
        if (!target) return;
        const action = target.dataset.action,
            id = target.dataset.id,
            d = T.data;
        try {
            if (action.startsWith("add-") || action.startsWith("edit-")) {
                openForm(action.split("-")[1], id);
                return;
            }
            if (action.startsWith("details-")) {
                const rec = action.endsWith("employee") ? T.employee(id) : T.batch(id);
                detail(
                    rec.name,
                    `<dl>${Object.entries(rec)
                        .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`)
                        .join(
                            "",
                        )}</dl><p>Linked enrollments: ${d.enrollments.filter((e) => e.employee === id || e.batch === id).length}</p>`,
                );
                return;
            }
            if (action.startsWith("delete-")) {
                const type = action.split("-")[1];
                detail(
                    "Delete " + type + "?",
                    `<p>This removes the record${type !== "enrollment" ? " and its related enrollments and certificates" : ""} from this browser.</p>${button("Confirm deletion", "confirm-delete-" + type, id, "btn btn-primary")}`,
                );
                return;
            }
            if (action.startsWith("confirm-delete-")) {
                const type = action.replace("confirm-delete-", "");
                const removed = d.enrollments
                    .filter((e) =>
                        type === "employee"
                            ? e.employee === id
                            : type === "batch"
                              ? e.batch === id
                              : e.id === id,
                    )
                    .map((e) => e.id);
                d.certificates = d.certificates.filter((c) => !removed.includes(c.enrollment));
                d.enrollments = d.enrollments.filter((e) => !removed.includes(e.id));
                if (type === "employee") d.employees = d.employees.filter((e) => e.id !== id);
                if (type === "batch") d.batches = d.batches.filter((e) => e.id !== id);
                document.getElementById("detail-dialog").close();
            }
            if (action === "attendance-certificate") {
                downloadCertificate(id, "Attendance");
                toast("Attendance certificate downloaded.");
            }
            if (action === "preview-certificate") {
                const e = d.enrollments.find((e) => e.id === id),
                    b = T.batch(e.batch);
                detail(
                    "Completion certificate preview",
                    `<div class="certificate-preview"><span>ELEVORA · ${esc(d.settings.company)}</span><h2>Training Completion Certificate</h2><p>Presented to</p><h3>${esc(T.employee(e.employee).name)}</h3><p>For completing ${esc(T.program(b.program).name)}</p><p>Training date: ${esc(b.date)}</p><p>Demo reference: ${esc(e.id)}-COMPLETION</p><p>Authorized signatory: __________________</p><small>Illustrative certificate. Not an independently verified credential.</small></div>${button("Download PDF", "certificate", id)}`,
                );
                return;
            }
            if (action === "certificate") {
                downloadCertificate(id);
                toast("Certificate PDF downloaded.");
            }
            if (action === "read")
                d.notifications.find((n) => n.id === id).read = !d.notifications.find(
                    (n) => n.id === id,
                ).read;
            if (action === "read-all") d.notifications.forEach((n) => (n.read = true));
            if (action === "print") window.print();
            if (action === "export") {
                const rows = [
                    [
                        "Enrollment",
                        "Employee",
                        "Department",
                        "Program",
                        "Batch",
                        "Enrolled",
                        "Attendance %",
                        "Completion %",
                        "Attendance certificate",
                        "Completion certificate",
                        "Selected session date",
                        "Session attendance",
                    ],
                    ...filteredEnrollments().map((e) => [
                        e.id,
                        T.employee(e.employee)?.name,
                        T.employee(e.employee)?.department,
                        T.program(T.batch(e.batch)?.program)?.name,
                        T.batch(e.batch)?.name,
                        e.date,
                        T.stats(e).attendance,
                        T.stats(e).completion,
                        d.certificates
                            .filter((c) => c.enrollment === e.id && c.type === "Attendance")
                            .map((c) => c.id)
                            .join("; "),
                        d.certificates
                            .filter((c) => c.enrollment === e.id && c.type !== "Attendance")
                            .map((c) => c.id)
                            .join("; "),
                        page === "attendance" ? attendanceDate : "",
                        page === "attendance" ? e.attendance[attendanceDate] || "Not recorded" : "",
                    ]),
                ];
                const csv = rows
                    .map((r) =>
                        r
                            .map(
                                (v) =>
                                    '"' +
                                    String(v ?? "")
                                        .replace(/^[=+@-]/, (char) => "'" + char)
                                        .replace(/"/g, '""') +
                                    '"',
                            )
                            .join(","),
                    )
                    .join("\r\n");
                const url = URL.createObjectURL(
                    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
                );
                const a = document.createElement("a");
                a.href = url;
                a.download = "elevora-training-report.csv";
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                toast("Filtered CSV exported.");
            }
            if (action === "reset") {
                detail(
                    "Reset sample data?",
                    `<p>This replaces all local training records. This cannot be undone.</p>${button("Replace with sample data", "confirm-reset", "", "btn btn-primary")}`,
                );
                return;
            }
            if (action === "confirm-reset") {
                T.reset();
                document.getElementById("detail-dialog").close();
            }
            T.save();
            render();
        } catch (e) {
            toast(e.message);
        }
    });
    document.addEventListener("change", (ev) => {
        const el = ev.target;
        if (el.dataset.attendance) {
            const e = T.data.enrollments.find((e) => e.id === el.dataset.attendance);
            if (el.value) e.attendance[attendanceDate] = el.value;
            else delete e.attendance[attendanceDate];
            T.save();
            render();
            toast("Attendance saved.");
        }
        if (el.dataset.module) {
            const e = T.data.enrollments.find((e) => e.id === el.dataset.module),
                i = +el.value;
            e.modules = el.checked
                ? [...new Set([...e.modules, i])]
                : e.modules.filter((n) => n !== i);
            T.save();
            render();
            toast("Module progress saved.");
        }
        const bindings = {
            "calendar-program": (v) => (programFilter = v),
            "department-filter": (v) => (department = v),
            "program-filter": (v) => (programFilter = v),
            "batch-filter": (v) => (batchFilter = v),
            "status-filter": (v) => (statusFilter = v),
            "date-from": (v) => (from = v),
            "date-to": (v) => (to = v),
            "attendance-date": (v) => (attendanceDate = v),
        };
        if (bindings[el.id]) {
            bindings[el.id](el.value);
            render();
        }
    });
    let debounce;
    document.addEventListener("input", (ev) => {
        if (ev.target.id === "record-search") {
            const pos = ev.target.selectionStart;
            search = ev.target.value;
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                render();
                const el = document.getElementById("record-search");
                el.focus();
                el.setSelectionRange(pos, pos);
            }, 200);
        }
    });
    document.querySelector("[data-sidebar-toggle]").addEventListener("click", (ev) => {
        const mobile = innerWidth <= 820;
        document.body.classList.toggle(mobile ? "sidebar-open" : "sidebar-collapsed");
        ev.currentTarget.setAttribute(
            "aria-expanded",
            String(
                mobile
                    ? document.body.classList.contains("sidebar-open")
                    : !document.body.classList.contains("sidebar-collapsed"),
            ),
        );
    });
    const sidebar = document.querySelector(".dashboard-sidebar"),
        sidebarToggle = document.querySelector("[data-sidebar-toggle]");
    sidebar
        .querySelectorAll("a,button")
        .forEach((el) => el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " ")));
    function syncSidebar() {
        const mobile = innerWidth <= 820,
            open = document.body.classList.contains("sidebar-open");
        sidebar.inert = mobile && !open;
        sidebarToggle.setAttribute(
            "aria-expanded",
            String(mobile ? open : !document.body.classList.contains("sidebar-collapsed")),
        );
    }
    sidebarToggle.addEventListener("click", () => {
        syncSidebar();
        if (innerWidth <= 820 && document.body.classList.contains("sidebar-open"))
            sidebar.querySelector("a").focus();
    });
    addEventListener("resize", syncSidebar);
    syncSidebar();
    document.addEventListener("click", (ev) => {
        if (
            innerWidth <= 820 &&
            document.body.classList.contains("sidebar-open") &&
            !ev.target.closest(".dashboard-sidebar,[data-sidebar-toggle]")
        ) {
            document.body.classList.remove("sidebar-open");
            syncSidebar();
        }
    });
    document.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape" && document.body.classList.contains("sidebar-open")) {
            document.body.classList.remove("sidebar-open");
            syncSidebar();
            sidebarToggle.focus();
        }
        if (
            ev.key === "Tab" &&
            innerWidth <= 820 &&
            document.body.classList.contains("sidebar-open")
        ) {
            const els = [...sidebar.querySelectorAll("a,button")],
                first = els[0],
                last = els.at(-1);
            if (ev.shiftKey && document.activeElement === first) {
                ev.preventDefault();
                last.focus();
            } else if (!ev.shiftKey && document.activeElement === last) {
                ev.preventDefault();
                first.focus();
            }
        }
    });
    document.querySelector("[data-logout]").addEventListener("click", () => {
        localStorage.removeItem("elevora-demo-session");
        sessionStorage.removeItem("elevora-demo-session");
        location.href = "../login.html";
    });
    render();
})();
