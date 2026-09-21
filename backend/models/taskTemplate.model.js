import mongoose from "mongoose";

const taskTemplateSchema = new mongoose.Schema(
  {
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

     assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    description: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },

    estimatedDays: {
      type: Number,
      default: 1,
      min: 1,
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

taskTemplateSchema.index({
  serviceType: 1,
  order: 1,
});

const TaskTemplate = mongoose.model(
  "TaskTemplate",
  taskTemplateSchema
);

export default TaskTemplate;