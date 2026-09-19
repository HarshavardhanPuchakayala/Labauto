import {
  createReportForLab,
  getReportsForLab,
  collectSample,
  enterResults,
  completeReport,
  deliverReport,
  getReportById
} from "../services/report.service.js";
export const createReportHandler = async (req, res, next) => {
  try {
    const report = await createReportForLab(
      req.body,
      req.user.labId,
      req.user.userId
    );

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const getReportsHandler = async (req, res, next) => {
  try {
    const reports = await getReportsForLab(req.user.labId);

    res.status(200).json({
      reports,
    });
  } catch (error) {
    next(error);
  }
};

export const collectSampleHandler = async (req, res, next) => {
  try {
    const report = await collectSample(
      req.params.id,
      req.user.labId
    );

    res.status(200).json({
      message: "Sample collected successfully",
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const enterResultsHandler = async (req, res, next) => {
  try {
    const report = await enterResults(
      req.params.id,
      req.user.labId,
      req.body.results
    );

    res.status(200).json({
      message: "Results entered successfully",
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const completeHandler = async (req, res, next) => {
  try {
    const report = await completeReport(
      req.params.id,
      req.user.labId
    );

    res.status(200).json({
      message: "Report completed successfully",
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const deliverReportHandler = async (req, res, next) => {
  try {
    const report = await deliverReport(
      req.params.id,
      req.user.labId,
      req.body.deliveryMethod
    );

    res.status(200).json({
      message: "Report delivered successfully",
      report,
    });
  } catch (error) {
    next(error);
  }
};

export const getReportByIdHandler = async (req, res, next) => {
  try {
    const report = await getReportById(
      req.params.id,
      req.user.labId
    );

    res.status(200).json({ report });
  } catch (error) {
    next(error);
  }
};