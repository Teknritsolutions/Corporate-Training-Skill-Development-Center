window.trainingCalendar = (year, month, programFilter) => {
    const first = new Date(year, month, 1),
        days = new Date(year, month + 1, 0).getDate();
    let cells = "";
    for (let i = 0; i < first.getDay(); i++)
        cells += '<div class="calendar-day" aria-hidden="true"></div>';
    for (let day = 1; day <= days; day++) {
        const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        cells += `<div class="calendar-day"><time datetime="${date}">${day}</time>${Training.data.batches
            .filter((b) => b.date === date && (!programFilter || b.program === programFilter))
            .map(
                (b) =>
                    `<button class="calendar-event" data-batch-detail="${b.id}" aria-label="${window.escapeHTML(b.name)} at ${b.time}; view session details"><span class="calendar-full">${window.escapeHTML(b.name)}<br>${b.time}<br>${b.capacity - Training.data.enrollments.filter((e) => e.batch === b.id).length} seats left</span><span class="calendar-compact" aria-hidden="true">${b.program.slice(0, 3).toUpperCase()}</span></button>`,
            )
            .join("")}</div>`;
    }
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const sessions = Training.data.batches
        .filter(
            (b) => b.date.startsWith(monthKey) && (!programFilter || b.program === programFilter),
        )
        .sort((a, b) => a.date.localeCompare(b.date));
    const agenda = `<div class="calendar-agenda"><h3>Sessions this month</h3>${sessions.length ? sessions.map((b) => `<button class="agenda-session" data-batch-detail="${b.id}"><strong>${window.escapeHTML(b.name)}</strong><span>${b.date} · ${b.time} · ${b.capacity - Training.data.enrollments.filter((e) => e.batch === b.id).length} seats available</span><span>View session details →</span></button>`).join("") : "<p>No sessions are scheduled for this month and program.</p>"}</div>`;
    return `<div class="calendar-toolbar actions"><button class="btn btn-outline" data-month="-1" aria-label="Previous month">←</button><h2>${first.toLocaleString("en", { month: "long", year: "numeric" })}</h2><button class="btn btn-outline" data-month="1" aria-label="Next month">→</button><button class="btn btn-outline" data-month="today">Today</button></div><p>Choose a training session to view its trainer, location, and capacity.</p><div class="calendar-grid">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<div class="calendar-weekday">${d}</div>`).join("")}${cells}</div>${agenda}`;
};
