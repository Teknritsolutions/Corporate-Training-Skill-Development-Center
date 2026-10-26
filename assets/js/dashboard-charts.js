window.renderTrainingCharts = () => {
    const T = Training,
        d = { ...T.data, enrollments: window.chartEnrollmentFilter?.() || T.data.enrollments },
        ink =
            getComputedStyle(document.documentElement).getPropertyValue("--text").trim() ||
            "#17263a";
    const end = new Date(),
        periods = Array.from(
            { length: 6 },
            (_, i) => new Date(end.getFullYear(), end.getMonth() - 5 + i, 1),
        );
    const keys = periods.map(
            (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}`,
        ),
        labels = periods.map((x) => x.toLocaleString("en", { month: "short", year: "2-digit" }));
    const att = d.enrollments.flatMap((e) => Object.values(e.attendance));
    const specs = [
        [
            "enrollment-chart",
            "bar",
            labels,
            keys.map((k) => d.enrollments.filter((e) => e.date.startsWith(k)).length),
            "Enrollments",
        ],
        [
            "completion-chart",
            "line",
            labels,
            keys.map((k) => {
                const es = d.enrollments.filter((e) => e.date.startsWith(k));
                return es.length
                    ? Math.round(
                          (es.filter((e) => T.stats(e).completion === 100).length / es.length) *
                              100,
                      )
                    : 0;
            }),
            "Current completion of monthly enrollment cohorts (%)",
        ],
        [
            "attendance-chart",
            "doughnut",
            ["Present / late", "Absent / excused", "Pending learners"],
            [
                att.filter((v) => ["Present", "Late"].includes(v)).length,
                att.filter((v) => ["Absent", "Excused"].includes(v)).length,
                d.enrollments.filter((e) => !Object.keys(e.attendance).length).length,
            ],
            "Attendance records",
        ],
        [
            "department-chart",
            "bar",
            d.departments,
            d.departments.map(
                (n) => d.enrollments.filter((e) => T.employee(e.employee)?.department === n).length,
            ),
            "Enrollments by department",
            "y",
        ],
        [
            "status-chart",
            "bar",
            d.programs.map((p) => p.name),
            d.programs.map((p) => {
                const es = d.enrollments.filter((e) => T.batch(e.batch)?.program === p.id);
                return es.length
                    ? Math.round(es.reduce((n, e) => n + T.stats(e).completion, 0) / es.length)
                    : 0;
            }),
            "Average completion (%)",
        ],
    ];
    window.trainingCharts?.forEach((c) => c.destroy());
    window.trainingCharts = [];
    for (const [id, type, labels, values, label, indexAxis] of specs) {
        const el = document.getElementById(id);
        if (!el) continue;
        const old = el.parentElement.nextElementSibling;
        if (old?.classList.contains("chart-summary")) old.remove();
        const summary = document.createElement("p");
        summary.className = "chart-summary";
        summary.textContent = labels.map((l, i) => `${l}: ${values[i]}`).join(" · ");
        el.parentElement.after(summary);
        window.trainingCharts.push(
            new Chart(el, {
                type,
                data: {
                    labels,
                    datasets: [
                        {
                            label,
                            data: values,
                            backgroundColor: [
                                "#087c78",
                                "#2763a5",
                                "#d6a85b",
                                "#819ab7",
                                "#a1c9c4",
                                "#5789bb",
                            ],
                            borderColor: "#438f9d",
                            borderWidth: 2,
                            tension: 0.3,
                        },
                    ],
                },
                options: {
                    indexAxis: indexAxis || "x",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: type === "doughnut",
                            labels: { color: ink, font: { size: 11 } },
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) =>
                                    `${ctx.dataset.label}: ${ctx.raw}${type === "doughnut" ? " (" + Math.round((ctx.raw / (values.reduce((a, b) => a + b, 0) || 1)) * 100) + "%)" : ""}`,
                            },
                        },
                    },
                    scales:
                        type !== "doughnut"
                            ? {
                                  x: { ticks: { color: ink, font: { size: 10 } } },
                                  y: { beginAtZero: true, ticks: { color: ink, precision: 0 } },
                              }
                            : {},
                },
            }),
        );
    }
};
document.addEventListener("themechange", () => window.renderTrainingCharts());
