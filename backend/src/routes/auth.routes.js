import express from "express";

import { registerHandler, loginHandler } from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, registerHandler);
router.post("/login", authLimiter, loginHandler);


export default router;