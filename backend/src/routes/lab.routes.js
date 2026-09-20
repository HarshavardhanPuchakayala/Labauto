import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  createLabHandler,
  renewLabHandler,
  getMyLabHandler,
  updateMyLabHandler,
  uploadMyLabLogoHandler,
  upload,
} from "../controllers/lab.controller.js";

const router = express.Router();

router.post("/", verifyToken, requireRole("owner"), createLabHandler);

router.patch("/:id/renew", verifyToken, requireRole("owner"), renewLabHandler);

router.get("/me", verifyToken, getMyLabHandler);
router.patch("/me", verifyToken, updateMyLabHandler);
router.post("/me/logo", verifyToken, upload.single("logo"), uploadMyLabLogoHandler);

export default router;