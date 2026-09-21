import mongoose from "mongoose";

const taskHistorySchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "TASK_CREATED",
        "TASK_ASSIGNED",
        "TASK_REASSIGNED",
        "STATUS_CHANGED",
        "TASK_SUBMITTED",
        "TASK_APPROVED",
        "CHANGES_REQUESTED",
        "WAITING_FOR_CLIENT",
      ],
      required: true,
    },

    fromStatus: {
      type: String,
      default: null,
    },

    toStatus: {
      type: String,
      default: null,
    },

    comment: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

taskHistorySchema.index({
  task: 1,
  createdAt: -1,
});

const TaskHistory = mongoose.model(
  "TaskHistory",
  taskHistorySchema
);

export default TaskHistory;