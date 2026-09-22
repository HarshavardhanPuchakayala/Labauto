import PDFDocument from "pdfkit";
import { generateBarcodeBuffer } from "../utils/barcode.js";

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

const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age >= 0 ? age : null;
};

function drawLetterhead(doc, lab, barcodeBuffer) {
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
  doc.font("Helvetica-Bold").fontSize(20).text(lab.name, textX, 20, { width: 260 });
  doc.font("Helvetica").fontSize(10);
  if (lab.tagline) doc.text(lab.tagline, textX, 44, { width: 260 });

  const contact = [lab.address, lab.phone, lab.email].filter(Boolean).join("   |   ");
  if (contact) doc.fontSize(8).text(contact, textX, lab.tagline ? 60 : 46, { width: 260 });

  // Barcode — white box, top-right of the banner, so it's scannable against the colored background
  if (barcodeBuffer) {
    const barcodeWidth = 140;
    const barcodeHeight = 55;
    const boxX = doc.page.width - 40 - barcodeWidth;
    doc.roundedRect(boxX, 15, barcodeWidth, barcodeHeight, 4).fill("#ffffff");
    try {
      doc.image(barcodeBuffer, boxX + 5, 20, { width: barcodeWidth - 10 });
    } catch (error) {
      console.error("Failed to embed barcode:", error.message);
    }
  }

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

function drawPatientInfo(doc, { patient, reportNumber, referredBy, sampleCollectedAt, reportDate, testCount }) {
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#0f172a").text("Patient Report", 50, doc.y);
  doc.moveDown(0.4);

  const age = getAge(patient.dob);
  const ageGender = [age !== null ? `${age} yrs` : null, patient.gender].filter(Boolean).join(" / ");

  doc.font("Helvetica").fontSize(9.5).fillColor("#1e293b");

  const leftCol = [
    `Patient Name: ${patient.name}`,
    `Patient ID: ${patient.patientId || "—"}`,
    ageGender ? `Age / Gender: ${ageGender}` : null,
  ].filter(Boolean);

  const rightCol = [
    `Report No.: ${reportNumber || "—"}`,
    `Report Date: ${formatDate(reportDate)}`,
    sampleCollectedAt ? `Sample Collected: ${formatDateTime(sampleCollectedAt)}` : null,
    referredBy ? `Referred By: Dr. ${referredBy}` : null,
    testCount > 1 ? `Number of Tests: ${testCount}` : null,
  ].filter(Boolean);

  const startY = doc.y;
  let y = startY;
  leftCol.forEach((line) => {
    doc.text(line, 50, y, { width: 260 });
    y += 14;
  });

  let yRight = startY;
  rightCol.forEach((line) => {
    doc.text(line, 320, yRight, { width: 225 });
    yRight += 14;
  });

  doc.y = Math.max(y, yRight) + 6;
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

  if (doc.y > doc.page.height - 90) doc.addPage();

  doc.strokeColor("#cbd5e1").moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
  doc.strokeColor("#000000");
  doc.moveDown(0.6);

  doc.font("Helvetica").fontSize(8).fillColor("#64748b");
  doc.text("This is a computer-generated report and does not require a signature.", 50, doc.y, {
    align: "center",
    width: doc.page.width - 100,
  });
  doc.fillColor("#000000");
}

export const buildReportPdf = async (report, lab, outputStream) => {
  const barcodeBuffer = await generateBarcodeBuffer(report.reportNumber || report._id.toString());

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(outputStream);

  drawLetterhead(doc, lab, barcodeBuffer);
  drawPatientInfo(doc, {
    patient: report.patient,
    reportNumber: report.reportNumber,
    referredBy: report.referredBy,
    sampleCollectedAt: report.sampleCollectedAt,
    reportDate: report.completedAt || report.createdAt,
    testCount: 1,
  });

  drawSection(doc, lab.reportHeaderColor || DEFAULT_HEADER_COLOR, {
    templateName: report.testTemplate.name,
    fields: report.testTemplate.fields,
    results: report.results,
    technicianName: report.technician?.name,
  });

  drawFooter(doc);
  doc.end();
};

export const buildCombinedReportPdf = async (reports, lab, outputStream) => {
  const first = reports[0];
  const barcodeBuffer = await generateBarcodeBuffer(first.visitId || first.reportNumber);

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  doc.pipe(outputStream);

  drawLetterhead(doc, lab, barcodeBuffer);
  drawPatientInfo(doc, {
    patient: first.patient,
    reportNumber: first.visitId,
    referredBy: first.referredBy,
    sampleCollectedAt: first.sampleCollectedAt,
    reportDate: first.completedAt || first.createdAt,
    testCount: reports.length,
  });

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