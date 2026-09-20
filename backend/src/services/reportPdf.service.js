
import PDFDocument from "pdfkit";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const COLS = {
  label: 50,
  value: 220,
  range: 330,
  unit: 445,
};

const ROW_HEIGHT = 20;

export const buildReportPdf = (report, lab, outputStream) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  doc.pipe(outputStream);

  // Watermark logo — drawn first so it sits behind everything else
  if (lab.logo?.data) {
    try {
      doc.save();
      doc.opacity(0.08);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const logoSize = 300;

      doc.image(
        lab.logo.data,
        (pageWidth - logoSize) / 2,
        (pageHeight - logoSize) / 2,
        {
          width: logoSize,
          height: logoSize,
        }
      );

      doc.opacity(1);
      doc.restore();
    } catch (error) {
      console.error(
        "Failed to draw watermark logo:",
        error.message
      );
    }
  }

  // Small logo at top of letterhead
  if (lab.logo?.data) {
    try {
      doc.image(lab.logo.data, {
        fit: [100, 60],
        align: "center",
      });

      doc.moveDown(0.5);
    } catch (error) {
      console.error(
        "Failed to embed lab logo:",
        error.message
      );
    }
  }

  // Letterhead
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(lab.name, {
      align: "center",
    });

  doc.font("Helvetica");

  if (lab.tagline) {
    doc
      .fontSize(10)
      .text(lab.tagline, {
        align: "center",
      });
  }

  const contact = [
    lab.address,
    lab.phone,
    lab.email,
  ]
    .filter(Boolean)
    .join(" | ");

  if (contact) {
    doc
      .fontSize(9)
      .text(contact, {
        align: "center",
      });
  }

  doc.moveDown(0.5);

  doc
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke();

  doc.moveDown(1.5);

  // Patient info
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Patient Report");

  doc.moveDown(0.5);

  doc.font("Helvetica").fontSize(11);

  doc.text(`Patient Name: ${report.patient.name}`);
  doc.text(
    `Patient ID: ${report.patient.patientId || "—"}`
  );
  doc.text(`Test: ${report.testTemplate.name}`);
  doc.text(
    `Technician: ${report.technician?.name || "—"}`
  );
  doc.text(
    `Date: ${formatDate(
      report.completedAt || report.createdAt
    )}`
  );

  doc.moveDown();

  // Results table
  const drawRow = (
    cells,
    bold = false,
    abnormal = false
  ) => {
    const font = bold
      ? "Helvetica-Bold"
      : "Helvetica";

    doc.font(font).fontSize(10);

    // Width of each column.
    //
    // 50 → 210  = 160px
    // 220 → 320 = 100px
    // 330 → 435 = 105px
    // 445 → 545 = 100px
    //
    // 545 is the right printable boundary
    // for a 50px margin on an A4 page.
    const colWidths = [
      COLS.value - COLS.label - 10,
      COLS.range - COLS.value - 10,
      COLS.unit - COLS.range - 10,
      doc.page.width - 50 - COLS.unit,
    ];

    const heights = cells.map((text, index) =>
      doc.heightOfString(String(text), {
        width: colWidths[index],
      })
    );

    const rowHeight = Math.max(
      ROW_HEIGHT,
      ...heights
    );

    // Add a new page if there isn't enough room
    // for the entire row.
    if (
      doc.y >
      doc.page.height -
        doc.page.margins.bottom -
        rowHeight
    ) {
      doc.addPage();
    }

    const y = doc.y;

    // Label
    doc.fillColor("black");

    doc.text(cells[0], COLS.label, y, {
      width: colWidths[0],
    });

    // Result
    // Abnormal numeric results are highlighted red.
    doc.fillColor(abnormal ? "red" : "black");

    doc.text(cells[1], COLS.value, y, {
      width: colWidths[1],
    });

    // Reset color so the remaining cells are always black.
    doc.fillColor("black");

    // Normal range / reference note
    doc.text(cells[2], COLS.range, y, {
      width: colWidths[2],
    });

    // Unit
    doc.text(cells[3], COLS.unit, y, {
      width: colWidths[3],
    });

    doc.y = y + rowHeight + 4;
  };

  // Table header
  drawRow(
    ["Test", "Result", "Normal Range", "Unit"],
    true
  );

  doc
    .moveTo(50, doc.y - 4)
    .lineTo(doc.page.width - 50, doc.y - 4)
    .stroke();

  const fields = report.testTemplate.fields || [];

  // Results
  (report.results || []).forEach((result) => {
    const field = fields.find(
      (f) => f.key === result.key
    );

    const range = field?.normalRange
      ? `${field.normalRange.min}–${field.normalRange.max}`
      : field?.referenceNote || "—";

    const isAbnormal =
      field?.normalRange &&
      typeof result.value === "number" &&
      (
        result.value < field.normalRange.min ||
        result.value > field.normalRange.max
      );

    drawRow(
      [
        field?.label || result.key,
        String(result.value),
        range,
        field?.unit || "",
      ],
      false,
      isAbnormal
    );
  });

  // Footer
  doc.x = doc.page.margins.left;

  doc.moveDown(2);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("black")
    .text(
      "This is a computer-generated report.",
      50,
      doc.y,
      {
        align: "center",
        width: doc.page.width - 100,
      }
    );

  doc.end();
};
