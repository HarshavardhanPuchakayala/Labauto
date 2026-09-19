import mongoose from "mongoose";

import AppError from "../utils/AppError.js";

import { findPatientById } from "../repositories/patient.repository.js";
import { findTemplateById } from "../repositories/testTemplate.repository.js";
import { findLabById } from "../repositories/lab.repository.js";

import {
  createReport,
  findReportsByLab,
  findReportById,
  updateReport,
} from "../repositories/report.repository.js";

export const createReportForLab = async (data, labId, technicianId) => {
  const patient = await findPatientById(data.patient);

  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  if (patient.labId.toString() !== labId.toString()) {
    throw new AppError("Patient does not belong to your lab", 403);
  }

  const template = await findTemplateById(data.testTemplate);

  if (!template) {
    throw new AppError("Test template not found", 404);
  }

  if (template.labId.toString() !== labId.toString()) {
    throw new AppError("Test template does not belong to your lab", 403);
  }

  const reportData = {
    ...data,
    labId,
    technician: technicianId,
  };

  return await createReport(reportData);
};

export const getReportsForLab = async (labId) => {
  return await findReportsByLab(labId);
};

export const getReportById = async (reportId, labId) => {
  const report = await findReportById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.labId.toString() !== labId.toString()) {
    throw new AppError("Report does not belong to your lab", 403);
  }

  return report;
};

export const collectSample = async (reportId, labId) => {
  const report = await findReportById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.labId.toString() !== labId.toString()) {
    throw new AppError("Report does not belong to your lab", 403);
  }

  if (report.status !== "pending") {
    throw new AppError("Report is not in pending state", 400);
  }

  return await updateReport(reportId, {
    status: "sample_collected",
    sampleCollectedAt: new Date(),
  });
};

export const enterResults = async (reportId, labId, resultsPayload) => {
  const report = await findReportById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.labId.toString() !== labId.toString()) {
    throw new AppError("Report does not belong to your lab", 403);
  }

  if (report.status !== "sample_collected") {
    throw new AppError("Sample must be collected before entering results", 400);
  }

  const template = await findTemplateById(report.testTemplate);

  if (!template) {
    throw new AppError("Test template not found", 404);
  }

  for (const item of resultsPayload) {
    const field = template.fields.find((field) => field.key === item.key);

    if (!field) {
      throw new AppError(`Invalid result key: ${item.key}`, 400);
    }

    if (field.type === "number" && typeof item.value !== "number") {
      throw new AppError(`${item.key} must be a number`, 400);
    }

    if (field.type === "text" && typeof item.value !== "string") {
      throw new AppError(`${item.key} must be text`, 400);
    }
  }

  return await updateReport(reportId, {
    results: resultsPayload,
    status: "result_entered",
    resultsEnteredAt: new Date(),
  });
};

export const completeReport = async (reportId, labId) => {
  const report = await findReportById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.labId.toString() !== labId.toString()) {
    throw new AppError("Report does not belong to your lab", 403);
  }

  if (report.status !== "result_entered") {
    throw new AppError("Results must be entered before completing", 400);
  }

  return await updateReport(reportId, {
    status: "completed",
    completedAt: new Date(),
  });
};

export const deliverReport = async (reportId, labId, deliveryMethod) => {
  const report = await findReportById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.labId.toString() !== labId.toString()) {
    throw new AppError("Report does not belong to your lab", 403);
  }

  if (report.status !== "completed") {
    throw new AppError("Report must be completed before delivery", 400);
  }

  if (!["digital", "physical"].includes(deliveryMethod)) {
    throw new AppError("Invalid delivery method", 400);
  }

  return await updateReport(reportId, {
    deliveryMethod,
    deliveredAt: new Date(),
  });
};

export const getReportForPdf = async (reportId, labId) => {
  if (!mongoose.isValidObjectId(reportId)) {
    throw new AppError("Invalid report ID", 400);
  }

  const report = await findReportById(reportId); // populates patient, testTemplate, technician
  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (report.labId.toString() !== labId.toString()) {
    throw new AppError("Report does not belong to your lab", 403);
  }

  // deliverReport doesn't change status, so "completed" covers delivered too.
  // Revisit this if you add a "delivered" status later.
  if (report.status !== "completed") {
    throw new AppError("Report must be completed before generating a PDF", 400);
  }

  // Validate everything the PDF needs BEFORE any bytes are sent
  if (!report.patient || !report.testTemplate) {
    throw new AppError("Report is missing patient or test template data", 422);
  }

  const lab = await findLabById(labId);
  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  return { report, lab };
};