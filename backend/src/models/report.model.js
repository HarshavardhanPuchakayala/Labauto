import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    testTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "TestTemplate", required: true },
    visitId: { type: String, index: true },
    reportNumber: { type: String, required: true },
    referredBy: { type: String, trim: true },
    results: { type: [resultSchema], default: [] },
    status: {
      type: String,
      enum: ["pending", "sample_collected", "result_entered", "completed"],
      default: "pending",
    },
    sampleCollectedAt: { type: Date },
    resultsEnteredAt: { type: Date },
    completedAt: { type: Date },
    deliveryMethod: { type: String, enum: ["digital", "physical"] },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

reportSchema.index({ labId: 1, reportNumber: 1 }, { unique: true });

export default mongoose.model("Report", reportSchema);