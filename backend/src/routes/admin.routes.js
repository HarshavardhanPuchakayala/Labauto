import express from "express";

import {
  getAllLabsHandler,
  getLabDetailHandler,
} from "../controllers/admin.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/labs",
  verifyToken,
  requireRole("owner"),
  getAllLabsHandler
);

router.get(
  "/labs/:id",
  verifyToken,
  requireRole("owner"),
  getLabDetailHandler
);

export default router;