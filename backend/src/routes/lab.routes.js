import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { createLabHandler } from "../controllers/lab.controller.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole("owner"),
  createLabHandler
);

export default router;