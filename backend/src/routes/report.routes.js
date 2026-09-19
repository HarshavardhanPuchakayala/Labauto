import express from "express";

import {
  createReportHandler,
  getReportsHandler,
  collectSampleHandler,
  enterResultsHandler,
  completeHandler,
  deliverReportHandler,
  getReportByIdHandler,
  generateReportPdfHandler
} from "../controllers/report.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createReportHandler);

router.get("/", verifyToken, getReportsHandler);
router.get("/:id", verifyToken, getReportByIdHandler);
router.get("/:id/pdf", verifyToken, generateReportPdfHandler);
router.patch(
  "/:id/collect-sample",
  verifyToken,
  collectSampleHandler
);

router.patch(
  "/:id/enter-results",
  verifyToken,
  enterResultsHandler
);

router.patch(
  "/:id/complete",
  verifyToken,
  completeHandler
);

router.patch(
  "/:id/deliver",
  verifyToken,
  deliverReportHandler
);

export default router;