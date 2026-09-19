import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
    provider: { type: String, required: true, trim: true },
    policyNumber: { type: String, required: true, trim: true },
    policyHolderName: { type: String, required: true, trim: true },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Insurance", insuranceSchema);