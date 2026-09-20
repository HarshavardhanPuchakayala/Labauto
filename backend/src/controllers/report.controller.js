import {
  createReportForLab,
  createReportsBatch,
  getReportsForLab,
  getReportById,
  getReportsByVisit,
  collectSample,
  enterResults,
  completeReport,
  deliverReport,
  getReportForPdf,
  getVisitForPdf,
} from "../services/report.service.js";

import { buildReportPdf, buildCombinedReportPdf } from "../services/reportPdf.service.js";

export const createReportHandler = async (req, res, next) => {
  try {
    const report = await createReportForLab(req.body, req.user.labId, req.user.userId);
    res.status(201).json({ message: "Report created successfully", report });
  } catch (error) {
    next(error);
  }
};

export const createReportsBatchHandler = async (req, res, next) => {
  try {
    const reports = await createReportsBatch(req.body, req.user.labId, req.user.userId);
    res.status(201).json({ message: `${reports.length} reports created successfully`, reports });
  } catch (error) {
    next(error);
  }
};

export const getReportsHandler = async (req, res, next) => {
  try {
    const reports = await getReportsForLab(req.user.labId);
    res.status(200).json({ reports });
  } catch (error) {
    next(error);
  }
};

export const getReportByIdHandler = async (req, res, next) => {
  try {
    const report = await getReportById(req.params.id, req.user.labId);
    res.status(200).json({ report });
  } catch (error) {
    next(error);
  }
};

export const getVisitHandler = async (req, res, next) => {
  try {
    const reports = await getReportsByVisit(req.params.visitId, req.user.labId);
    res.status(200).json({ reports });
  } catch (error) {
    next(error);
  }
};

export const collectSampleHandler = async (req, res, next) => {
  try {
    const report = await collectSample(req.params.id, req.user.labId);
    res.status(200).json({ message: "Sample collected successfully", report });
  } catch (error) {
    next(error);
  }
};

export const enterResultsHandler = async (req, res, next) => {
  try {
    const report = await enterResults(req.params.id, req.user.labId, req.body.results);
    res.status(200).json({ message: "Results entered successfully", report });
  } catch (error) {
    next(error);
  }
};

export const completeHandler = async (req, res, next) => {
  try {
    const report = await completeReport(req.params.id, req.user.labId);
    res.status(200).json({ message: "Report completed successfully", report });
  } catch (error) {
    next(error);
  }
};

export const deliverReportHandler = async (req, res, next) => {
  try {
    const report = await deliverReport(req.params.id, req.user.labId, req.body.deliveryMethod);
    res.status(200).json({ message: "Report delivered successfully", report });
  } catch (error) {
    next(error);
  }
};

export const generateReportPdfHandler = async (req, res, next) => {
  try {
    const { report, lab } = await getReportForPdf(req.params.id, req.user.labId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="report-${report._id}.pdf"`);
    buildReportPdf(report, lab, res);
  } catch (error) {
    if (res.headersSent) return res.destroy(error);
    next(error);
  }
};

export const getVisitPdfHandler = async (req, res, next) => {
  try {
    const { reports, lab } = await getVisitForPdf(req.params.visitId, req.user.labId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="visit-${req.params.visitId}.pdf"`);
    buildCombinedReportPdf(reports, lab, res);
  } catch (error) {
    if (res.headersSent) return res.destroy(error);
    next(error);
  }
};