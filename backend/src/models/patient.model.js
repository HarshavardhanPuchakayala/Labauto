import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true, trim: true }, // unique per-lab, not global — see index below
    name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String, required: false, trim: true, index: true },
    email: { type: String, required: false, trim: true, lowercase: true },
    address: { type: String, required: false, trim: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
  },
  { timestamps: true }
);

// Unique PER LAB, not globally — two labs can both have PAT-000001
patientSchema.index({ labId: 1, patientId: 1 }, { unique: true });

export default mongoose.model("Patient", patientSchema);