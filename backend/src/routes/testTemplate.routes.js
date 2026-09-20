import express from "express";
import { createTemplateHandler, getTemplatesHandler, seedDefaultTemplatesHandler, updateTemplateHandler } from "../controllers/testTemplate.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createTemplateHandler);
router.get("/", verifyToken, getTemplatesHandler);
router.post("/seed-defaults", verifyToken, seedDefaultTemplatesHandler);
router.patch("/:id", verifyToken, updateTemplateHandler);

export default router;