import express from "express";
import { createPatientHandler, getPatientsHandler, getPatientByIdHandler, updatePatientHandler } from "../controllers/patient.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createPatientHandler);
router.get("/", verifyToken, getPatientsHandler);
router.get("/:id", verifyToken, getPatientByIdHandler);
router.patch("/:id", verifyToken, updatePatientHandler);
export default router;