import PDFDocument from "pdfkit";

const DEFAULT_HEADER_COLOR = "#0d9488";
const COLS = { test: 50, result: 260, range: 350, unit: 480 };
const ROW_HEIGHT = 18;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function drawLetterhead(doc, lab) {
  const headerColor = lab.reportHeaderColor || DEFAULT_HEADER_COLOR;
  const bannerHeight = 90;

  doc.rect(0, 0, doc.page.width, bannerHeight).fill(headerColor);

  let textX = 50;
  if (lab.logo?.data) {
    try {
      doc.image(lab.logo.data, 40, 15, { fit: [60, 60] });
      textX = 112;
    } catch (error) {
      console.error("Failed to embed lab logo:", error.message);
    }
  }

  doc.fillColor("#ffffff");
  doc.font("Helvetica-Bold").fontSize(20).text(lab.name, textX, 20, { width: doc.page.width - textX - 50 });
  doc.font("Helvetica").fontSize(10);
  if (lab.tagline) doc.text(lab.tagline, textX, 44, { width: doc.page.width - textX - 50 });

  const contact = [lab.address, lab.phone, lab.email].filter(Boolean).join("   |   ");
  if (contact) doc.fontSize(8).text(contact, textX, lab.tagline ? 60 : 46, { width: doc.page.width - textX - 50 });

  doc.fillColor("#000000");
  doc.y = bannerHeight + 20;

  if (lab.logo?.data) {
    try {
      doc.save();
      doc.opacity(0.06);
      const logoSize = 280;
      doc.image(lab.logo.data, (doc.page.width - logoSize) / 2, (doc.page.height - logoSize) / 2, {
        width: logoSize,
        height: logoSize,
      });
      doc.opacity(1);
      doc.restore();
    } catch (error) {
      console.error("Failed to draw watermark logo:", error.message);
    }
  }
}

function drawPatientInfo(doc, patient, extraLines = []) {
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#0f172a").text("Patient Report", 50, doc.y);
  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(10).fillColor("#1e293b");
  doc.text(`Patient Name: ${patient.name}`, 50);
  doc.text(`Patient ID: ${patient.patientId || "—"}`, 50);
  extraLines.forEach((line) => doc.text(line, 50));
  doc.moveDown(0.8);
  doc.strokeColor("#cbd5e1").moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
  doc.strokeColor("#000000").fillColor("#000000");
  doc.moveDown(0.8);
}

function drawSection(doc, headerColor, section) {
  if (doc.y > doc.page.height - doc.page.margins.bottom - 100) doc.addPage();

  doc.font("Helvetica-Bold").fontSize(12).fillColor(headerColor).text(section.templateName, 50, doc.y);
  doc.fillColor("#000000");
  doc.moveDown(0.2);

  if (section.technicianName) {
    doc.font("Helvetica").fontSize(8).fillColor("#64748b").text(`Technician: ${section.technicianName}`, 50);
    doc.fillColor("#000000");
  }
  doc.moveDown(0.4);

  const colWidths = [
    COLS.result - COLS.test - 10,
    COLS.range - COLS.result - 10,
    COLS.unit - COLS.range - 10,
    doc.page.width - 50 - COLS.unit,
  ];

  const drawTableHeader = () => {
    const y = doc.y;
    doc.fillOpacity(0.12).fillColor(headerColor).rect(50, y - 3, doc.page.width - 100, 20).fill();
    doc.fillOpacity(1).fillColor("#0f172a").font("Helvetica-Bold").fontSize(8.5);
    doc.text("TEST", COLS.test, y + 3, { width: colWidths[0] });
    doc.text("RESULT", COLS.result, y + 3, { width: colWidths[1] });
    doc.text("BIOLOGICAL REF. RANGE", COLS.range, y + 3, { width: colWidths[2] });
    doc.text("UNIT", COLS.unit, y + 3, { width: colWidths[3] });
    doc.y = y + 22;
    doc.fillColor("#000000");
  };

  drawTableHeader();

  const drawRow = (cells, abnormal, direction) => {
    doc.fontSize(9.5);

    const heights = cells.map((text, i) => doc.heightOfString(String(text), { width: colWidths[i] }));
    const rowHeight = Math.max(ROW_HEIGHT, ...heights);

    if (doc.y > doc.page.height - doc.page.margins.bottom - rowHeight) {
      doc.addPage();
      drawTableHeader();
    }

    const y = doc.y;
    doc.font("Helvetica-Bold").fillColor("#1e293b");
    doc.text(cells[0], COLS.test, y, { width: colWidths[0] });

    doc.font(abnormal ? "Helvetica-Bold" : "Helvetica");
    doc.fillColor(abnormal ? "#dc2626" : "#1e293b");
    const resultText = direction ? `${cells[1]}  ${direction}` : cells[1];
    doc.text(resultText, COLS.result, y, { width: colWidths[1] });

    doc.font("Helvetica").fillColor("#475569");
    doc.text(cells[2], COLS.range, y, { width: colWidths[2] });
    doc.text(cells[3], COLS.unit, y, { width: colWidths[3] });

    doc.fillColor("#000000");
    doc.y = y + rowHeight + 6;

    doc.strokeColor("#e2e8f0").moveTo(50, doc.y - 3).lineTo(doc.page.width - 50, doc.y - 3).stroke();
    doc.strokeColor("#000000");
  };

  const fields = section.fields || [];
  (section.results || []).forEach((result) => {
    const field = fields.find((f) => f.key === result.key);
    const range = field?.normalRange
      ? `${field.normalRange.min} - ${field.normalRange.max}`
      : field?.referenceNote || "—";

    let abnormal = false;
    let direction = "";
    if (field?.normalRange && typeof result.value === "number") {
      if (result.value < field.normalRange.min) {
        abnormal = true;
        direction = "L";
      } else if (result.value > field.normalRange.max) {
        abnormal = true;
        direction = "H";
      }
    }

    drawRow([field?.label || result.key, String(result.value), range, field?.unit || ""], abnormal, direction);
  });

  doc.moveDown(1);
}

function drawFooter(doc) {
  doc.x = doc.page.margins.left;
  doc.moveDown(1.5);
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#64748b")
    .text("This is a computer-generated report and does not require a signature.", 50, doc.y, {
      align: "center",
      width: doc.page.width - 100,
    });
  doc.fillColor("#000000");
}

export const buildReportPdf = (report, lab, outputStream) => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(outputStream);

  drawLetterhead(doc, lab);
  drawPatientInfo(doc, report.patient, [`Report Date: ${formatDate(report.completedAt || report.createdAt)}`]);

  drawSection(doc, lab.reportHeaderColor || DEFAULT_HEADER_COLOR, {
    templateName: report.testTemplate.name,
    fields: report.testTemplate.fields,
    results: report.results,
    technicianName: report.technician?.name,
  });

  drawFooter(doc);
  doc.end();
};

export const buildCombinedReportPdf = (reports, lab, outputStream) => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(outputStream);

  drawLetterhead(doc, lab);

  const first = reports[0];
  drawPatientInfo(doc, first.patient, [
    `Report Date: ${formatDate(first.completedAt || first.createdAt)}`,
    `Number of Tests: ${reports.length}`,
  ]);

  reports.forEach((report) => {
    drawSection(doc, lab.reportHeaderColor || DEFAULT_HEADER_COLOR, {
      templateName: report.testTemplate.name,
      fields: report.testTemplate.fields,
      results: report.results,
      technicianName: report.technician?.name,
    });
  });

  drawFooter(doc);
  doc.end();
};