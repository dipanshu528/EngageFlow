import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    engagement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Engagement",
      required: true,
    },

    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskTemplate",
      default: null,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "NOT_STARTED",
        "IN_PROGRESS",
        "WAITING_FOR_CLIENT",
        "READY_FOR_REVIEW",
        "CHANGES_REQUESTED",
        "COMPLETED",
      ],
      default: "NOT_STARTED",
    },

    dueDate: {
      type: Date,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewComment: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// Add indexes

taskSchema.index({
  assignedTo: 1,
  status: 1,
});

taskSchema.index({
  dueDate: 1,
  status: 1,
});

taskSchema.index({
  engagement: 1,
});

// Prevent duplicate template task inside one engagement
taskSchema.index(
  {
    engagement: 1,
    template: 1
  },
  {
    unique: true,
    sparse: true
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;