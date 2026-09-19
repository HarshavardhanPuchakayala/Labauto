import express from "express";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { uploadLogo } from "../middlewares/upload.middleware.js";

import {
  createLabHandler,
  renewLabHandler,
  uploadLogoHandler,
} from "../controllers/lab.controller.js";

const router = express.Router();

router.post("/", verifyToken, requireRole("owner"), createLabHandler);

// Auth and role checks run BEFORE multer, so unauthorized users never get to buffer a file
router.put(
  "/logo",
  verifyToken,
  requireRole("owner"),
  uploadLogo,
  uploadLogoHandler
);

router.patch("/:id/renew", verifyToken, requireRole("owner"), renewLabHandler);

export default router;