window.downloadCertificate = (id, type = "Completion") => {
    const e = Training.data.enrollments.find((e) => e.id === id);
    if (
        !e ||
        !(type === "Attendance"
            ? Training.stats(e).attendance >= Training.data.settings.attendance
            : Training.eligible(e))
    )
        throw Error("Attendance and completion thresholds must be met first.");
    let record = Training.data.certificates.find((c) => c.enrollment === id && c.type === type);
    if (!record) {
        record = {
            id: "STK-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
            enrollment: id,
            type,
            date: new Date().toISOString().slice(0, 10),
        };
        Training.data.certificates.push(record);
        Training.save();
    }
    const pdf = new jspdf.jsPDF({ orientation: "landscape" }),
        person = Training.employee(e.employee),
        batch = Training.batch(e.batch);
    pdf.setDrawColor(214, 168, 91);
    pdf.setLineWidth(2);
    pdf.rect(12, 12, 273, 186);
    pdf.setTextColor(20, 43, 73);
    pdf.setFontSize(20);
    pdf.text("ELEVORA | " + Training.data.settings.company, 148, 40, { align: "center" });
    pdf.setFontSize(32);
    pdf.text(
        type === "Attendance" ? "Attendance certificate" : "Certificate of completion",
        148,
        70,
        { align: "center" },
    );
    pdf.setFontSize(14);
    pdf.text("This certifies that", 148, 94, { align: "center" });
    pdf.setFontSize(26);
    pdf.text(person.name, 148, 113, { align: "center" });
    pdf.setFontSize(14);
    pdf.text(
        (type === "Attendance" ? "has attended " : "has completed ") +
            Training.program(batch.program).name,
        148,
        137,
        { align: "center" },
    );
    pdf.text("Training " + batch.date + " | Issued " + record.date + " | " + record.id, 148, 158, {
        align: "center",
    });
    pdf.setFontSize(11);
    pdf.text("Authorized signatory: __________________", 148, 173, { align: "center" });
    pdf.setFontSize(10);
    pdf.text("Front-end demonstration certificate - not an accredited qualification.", 148, 185, {
        align: "center",
    });
    pdf.save(record.id + ".pdf");
    return record;
};
