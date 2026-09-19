import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { addInsuranceHandler, getInsurancesHandler } from "../controllers/insurance.controller.js";

const router = express.Router();

router.post("/", verifyToken, addInsuranceHandler);
router.get("/:patientId", verifyToken, getInsurancesHandler);

export default router;