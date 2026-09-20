import PDFDocument from "pdfkit";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const COLS = { label: 50, value: 300, unit: 430 };
const ROW_HEIGHT = 20;

export const buildReportPdf = (report, lab, outputStream) => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(outputStream);

  // Logo (if the lab has one uploaded)
  if (lab.logo?.data) {
    try {
      doc.image(lab.logo.data, {
        fit: [100, 60],
        align: "center",
      });
      doc.moveDown(0.5);
    } catch (error) {
      // Corrupt/invalid image data shouldn't crash PDF generation
      console.error("Failed to embed lab logo:", error.message);
    }
  }

  // Letterhead
  doc.font("Helvetica-Bold").fontSize(20).text(lab.name, { align: "center" });
  doc.font("Helvetica");
  if (lab.tagline) doc.fontSize(10).text(lab.tagline, { align: "center" });

  const contact = [lab.address, lab.phone, lab.email].filter(Boolean).join(" | ");
  if (contact) doc.fontSize(9).text(contact, { align: "center" });

  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
  doc.moveDown(1.5);

  // Patient info
  doc.font("Helvetica-Bold").fontSize(14).text("Patient Report");
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(11);
  doc.text(`Patient Name: ${report.patient.name}`);
  doc.text(`Patient ID: ${report.patient.patientId || "—"}`);
  doc.text(`Test: ${report.testTemplate.name}`);
  doc.text(`Technician: ${report.technician?.name || "—"}`);
  doc.text(`Date: ${formatDate(report.completedAt || report.createdAt)}`);
  doc.moveDown();

  // Results table — row height measured dynamically to avoid overlap on wrapped text
  const drawRow = (cells, bold = false) => {
    const font = bold ? "Helvetica-Bold" : "Helvetica";
    doc.font(font).fontSize(11);

    const colWidths = [
      COLS.value - COLS.label - 10,
      COLS.unit - COLS.value - 10,
      doc.page.width - 50 - COLS.unit,
    ];

    const heights = cells.map((text, i) =>
      doc.heightOfString(String(text), { width: colWidths[i] })
    );
    const rowHeight = Math.max(ROW_HEIGHT, ...heights);

    if (doc.y > doc.page.height - doc.page.margins.bottom - rowHeight) {
      doc.addPage();
    }

    const y = doc.y;
    doc.text(cells[0], COLS.label, y, { width: colWidths[0] });
    doc.text(cells[1], COLS.value, y, { width: colWidths[1] });
    doc.text(cells[2], COLS.unit, y, { width: colWidths[2] });
    doc.y = y + rowHeight + 4;
  };

  drawRow(["Test", "Result", "Unit"], true);
  doc.moveTo(50, doc.y - 4).lineTo(doc.page.width - 50, doc.y - 4).stroke();

  const fields = report.testTemplate.fields || [];
  (report.results || []).forEach((result) => {
    const field = fields.find((f) => f.key === result.key);
    drawRow([field?.label || result.key, String(result.value), field?.unit || ""]);
  });

  // Footer
  doc.x = doc.page.margins.left;
  doc.moveDown(2);
  doc
    .font("Helvetica")
    .fontSize(9)
    .text("This is a computer-generated report.", 50, doc.y, {
      align: "center",
      width: doc.page.width - 100,
    });

  doc.end();
};