import mongoose from "mongoose";

const serviceTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    engagementType: {
      type: String,
      enum: ["RECURRING", "ONE_TIME"],
      required: true,
    },

    frequency: {
      type: String,
      enum: ["MONTHLY", "QUARTERLY", "YEARLY", null],
      default: null,
    },

    description: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceType = mongoose.model("ServiceType", serviceTypeSchema);

export default ServiceType;