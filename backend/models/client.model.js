import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    tradeName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    gstin: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GSTIN format",
      ],
    },

    pan: {
      type: String,
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{5}\d{4}[A-Z]{1}$/, "Invalid PAN format"],
    },

    registrationType: {
      type: String,
      enum: ["REGULAR", "COMPOSITION", "CASUAL_TAXABLE", "INPUT_SERVICE_DISTRIBUTOR"],
      default: "REGULAR",
    },

    filingFrequency: {
      type: String,
      enum: ["MONTHLY", "QUARTERLY"],
      default: "MONTHLY",
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    authorizedSignatory: {
      name: { type: String, trim: true },
      email: { type: String, lowercase: true, trim: true },
      phone: { type: String, trim: true },
    },

    gstStatus: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "SUSPENDED"],
      default: "ACTIVE",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;