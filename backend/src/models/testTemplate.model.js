import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true },
    unit: { type: String, trim: true },
    type: { type: String, enum: ["number", "text"], required: true },
    // Optional reference range — for "number" fields
    normalRange: {
      min: { type: Number },
      max: { type: Number },
    },
    // Optional free-text reference note — for qualitative fields, or gender-specific ranges
    referenceNote: { type: String, trim: true },
  },
  { _id: false }
);

const testTemplateSchema = new mongoose.Schema(
  {
    labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
    name: { type: String, required: true, trim: true },
    fields: {
      type: [fieldSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "A template must have at least one field",
      },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

testTemplateSchema.index({ labId: 1, name: 1 }, { unique: true });

export default mongoose.model("TestTemplate", testTemplateSchema);