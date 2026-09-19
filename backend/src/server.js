import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import { verifyToken } from "./middlewares/auth.middleware.js";
import errorHandler from "./middlewares/errorHandler.js";

import patientRoutes from "./routes/patient.routes.js";
import authRoutes from "./routes/auth.routes.js";
import labRoutes from "./routes/lab.routes.js";
import testTemplateRoutes from "./routes/testTemplate.routes.js";
import reportRoutes from "./routes/report.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import insuranceRoutes from "./routes/insurance.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));
app.use(express.json());



app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/patients", patientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/labs", labRoutes);
app.use("/api/test-templates", testTemplateRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/insurance", insuranceRoutes);

app.use(errorHandler);
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
};

startServer();