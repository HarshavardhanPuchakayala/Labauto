import mongoose from "mongoose";

const logoSchema = new mongoose.Schema(
  {
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ["image/png", "image/jpeg"],
    },
  },
  { _id: false }
);

const labSchema = new mongoose.Schema(
  {
    labId: {
      type: String,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    subscriptionStatus: {
      type: String,
      enum: ["trial", "active", "expired"],
      default: "trial",
    },

    subscriptionExpiresAt: {
      type: Date,
      required: true,
    },

    tagline: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    // Bytes are hidden from every normal query. Only the PDF path opts in.
    logo: {
      type: logoSchema,
      select: false,
    },

    // Lightweight flag so the UI knows whether a logo exists without loading the bytes
    hasLogo: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Lab = mongoose.model("Lab", labSchema);

export default Lab;