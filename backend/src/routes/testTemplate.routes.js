
import express from "express";
import {
  createTemplateHandler,
  getTemplatesHandler,
} from "../controllers/testTemplate.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createTemplateHandler);

router.get("/", verifyToken, getTemplatesHandler);

export default router;