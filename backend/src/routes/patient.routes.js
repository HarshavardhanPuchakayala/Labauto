import express from "express";
import {
  createPatientHandler,
  getPatientsHandler,
} from "../controllers/patient.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createPatientHandler);

router.get("/", verifyToken, getPatientsHandler);

export default router;