import Task from "../models/task.model.js";
import TaskHistory from "../models/taskHistory.model.js";

export const getTaskHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check whether task exists
    const task = await Task.findById(id).select("assignedTo");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // TEAM_MEMBER can only view history of their own task
    if (
      req.user.role === "TEAM_MEMBER" &&
      task.assignedTo.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only view history of your own tasks"
      });
    }

    // Get task history
    const history = await TaskHistory.find({
      task: id
    })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      history
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};