/* One versioned, browser-local store powers every dashboard view. */
window.Training = (() => {
    const key = "elevora-training-v1";
    const programs = [
        { id: "communication", name: "Communication Skills", modules: 4 },
        { id: "leadership", name: "Leadership Development", modules: 4 },
        { id: "sales", name: "Sales Excellence", modules: 4 },
        { id: "technical", name: "Technical Upskilling", modules: 4 },
    ];
    function seed() {
        return {
            version: 1,
            employees: [
                "Aisha Patel",
                "Daniel Brooks",
                "Sofia Chen",
                "Marcus Reed",
                "Elena Garcia",
                "James Wilson",
                "Priya Shah",
                "Noah Kim",
                "Olivia Martin",
                "Ethan Lewis",
                "Maya Singh",
                "Leo Taylor",
            ].map((name, i) => ({
                id: "EMP" + String(i + 1).padStart(3, "0"),
                name,
                email: name.toLowerCase().replace(" ", ".") + "@example.com",
                department: ["HR", "Sales", "IT", "Operations", "Finance"][i % 5],
                role: ["Manager", "Specialist", "Associate"][i % 3],
                status: "Active",
            })),
            departments: ["HR", "Sales", "IT", "Operations", "Finance"],
            programs,
            batches: [
                ...programs.map((p, i) => ({
                    id: "BAT" + (i + 1),
                    name: p.name + " · October",
                    program: p.id,
                    capacity: 12,
                    date: "2026-10-19",
                    trainer: ["Maya Bennett", "James Carter", "Elena Rossi", "David Park"][i],
                    time: "09:00",
                    location: i % 2 ? "Virtual classroom" : "Learning studio A",
                })),
                {
                    id: "BAT5",
                    name: "Communication Skills · November",
                    program: "communication",
                    capacity: 12,
                    date: "2026-11-09",
                    trainer: "Maya Bennett",
                    time: "09:00",
                    location: "Learning studio A",
                },
                {
                    id: "BAT6",
                    name: "Leadership Development · November",
                    program: "leadership",
                    capacity: 10,
                    date: "2026-11-12",
                    trainer: "James Carter",
                    time: "10:00",
                    location: "Virtual classroom",
                },
            ],
            enrollments: Array.from({ length: 12 }, (_, i) => ({
                id: "ENR" + (i + 1),
                employee: "EMP" + String(i + 1).padStart(3, "0"),
                batch: "BAT" + ((i % 4) + 1),
                date: "2026-" + String(5 + (i % 6)).padStart(2, "0") + "-15",
                modules: i < 4 ? Array.from({ length: programs[i % 4].modules }, (_, j) => j) : [0],
                attendance:
                    i > 9
                        ? {}
                        : {
                              "2026-10-19": i === 5 ? "Absent" : "Present",
                              "2026-10-20": i === 6 ? "Absent" : "Present",
                          },
            })),
            certificates: [],
            notifications: [
                {
                    id: "N1",
                    title: "Welcome to your training workspace",
                    text: "All records are fictional and saved only in this browser.",
                    read: false,
                },
                {
                    id: "N2",
                    title: "November cohorts are ready",
                    text: "Review capacity and enroll your team.",
                    read: false,
                },
            ],
            settings: { attendance: 80, completion: 100, company: "AcmeWorks" },
            profile: { name: "Alex Morgan", email: "hr@elevora.example", role: "Training Manager" },
        };
    }
    let data;
    try {
        data = JSON.parse(localStorage.getItem(key));
    } catch {}
    if (!data || data.version !== 1) data = seed();
    const save = () => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch {
            throw Error(
                "Browser storage is full or unavailable. Export your records before continuing.",
            );
        }
    };
    const employee = (id) => data.employees.find((x) => x.id === id),
        batch = (id) => data.batches.find((x) => x.id === id),
        program = (id) => data.programs.find((x) => x.id === id);
    function stats(e) {
        const b = batch(e.batch),
            p = program(b?.program),
            values = Object.values(e.attendance || {});
        return {
            attendance: values.length
                ? Math.round(
                      (values.filter((v) => v === "Present" || v === "Late").length /
                          values.length) *
                          100,
                  )
                : 0,
            completion: p ? Math.round(((e.modules || []).length / p.modules) * 100) : 0,
        };
    }
    function eligible(e) {
        const s = stats(e);
        return s.attendance >= data.settings.attendance && s.completion >= data.settings.completion;
    }
    function enroll(employeeId, batchId) {
        if (!employee(employeeId) || !batch(batchId))
            throw Error("Select a valid employee and batch.");
        if (data.enrollments.some((e) => e.employee === employeeId && e.batch === batchId))
            throw Error("This employee is already enrolled in this batch.");
        if (data.enrollments.filter((e) => e.batch === batchId).length >= batch(batchId).capacity)
            throw Error("This batch has reached its capacity.");
        data.enrollments.push({
            id: "ENR" + Date.now(),
            employee: employeeId,
            batch: batchId,
            date: new Date().toISOString().slice(0, 10),
            modules: [],
            attendance: {},
        });
        save();
    }
    function reset() {
        data = seed();
        save();
        return data;
    }
    return {
        get data() {
            return data;
        },
        save,
        employee,
        batch,
        program,
        stats,
        eligible,
        enroll,
        reset,
    };
})();
