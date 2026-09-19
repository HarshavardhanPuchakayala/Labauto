import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { createLabHandler,renewLabHandler } from "../controllers/lab.controller.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole("owner"),
  createLabHandler
);

router.patch(
  "/:id/renew",
  verifyToken,
  requireRole("owner"),
  renewLabHandler
);

export default router;