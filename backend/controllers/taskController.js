import Task from "../models/task.model.js";
import TaskHistory from "../models/taskHistory.model.js";

import {
  isValidTransition
} from "../services/taskWorkflowService.js";


// GET ALL TASKS
export const getTasks = async (req, res) => {
  try {
    let filter = {};

    // Team member can see only their own tasks
    if (req.user.role === "TEAM_MEMBER") {
      filter.assignedTo = req.user.userId;
    }

    const tasks = await Task.find(filter)
      .populate({
        path: "engagement",
        populate: [
          {
            path: "client",
            select: "name email"
          },
          {
            path: "serviceType",
            select: "name engagementType frequency"
          }
        ]
      })
      .populate(
        "template",
        "title description order estimatedDays"
      )
      .populate(
        "assignedTo",
        "name email role"
      )
      .sort({ dueDate: 1 });

    res.status(200).json({
      tasks
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// GET SINGLE TASK
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "engagement",
        populate: [
          {
            path: "client",
            select: "name email"
          },
          {
            path: "serviceType",
            select: "name engagementType frequency"
          }
        ]
      })
      .populate(
        "template",
        "title description order estimatedDays"
      )
      .populate(
        "assignedTo",
        "name email role"
      )
      .populate(
        "reviewedBy",
        "name email role"
      );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // Team member can access only their own task
    if (
      req.user.role === "TEAM_MEMBER" &&
      task.assignedTo._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only view your own tasks"
      });
    }

    res.status(200).json({
      task
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// UPDATE TASK STATUS
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    // 1. Validate status
    const validStatuses = [
      "NOT_STARTED",
      "IN_PROGRESS",
      "WAITING_FOR_CLIENT",
      "READY_FOR_REVIEW",
      "CHANGES_REQUESTED",
      "COMPLETED",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    // 2. Find task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // 3. Check workflow transition
    const oldStatus = task.status;

    if (!isValidTransition(oldStatus, status)) {
      return res.status(400).json({
        message:
          `Invalid workflow transition: ${oldStatus} → ${status}`,
      });
    }

    // 4. Authorization

    // Safety check for assignedTo
    const isAssignedUser =
      task.assignedTo &&
      task.assignedTo.toString() === req.user.userId;

    const isManager =
      req.user.role === "MANAGER";

    const isAdmin =
      req.user.role === "ADMIN";

    // Team members can update only their own tasks
    if (
      req.user.role === "TEAM_MEMBER" &&
      !isAssignedUser
    ) {
      return res.status(403).json({
        message:
          "You can only update your own tasks",
      });
    }

    // 5. Manager/Admin approval
    if (status === "COMPLETED") {
      if (!isManager && !isAdmin) {
        return res.status(403).json({
          message:
            "Only a manager or admin can complete a task",
        });
      }

      // Manager/Admin cannot approve own task
      if (isAssignedUser) {
        return res.status(403).json({
          message:
            "You cannot approve your own task",
        });
      }

      task.reviewedAt = new Date();
      task.reviewedBy = req.user.userId;
      task.reviewComment = comment || null;
    }

    // 6. Changes requested
    if (status === "CHANGES_REQUESTED") {
      if (!isManager && !isAdmin) {
        return res.status(403).json({
          message:
            "Only a manager or admin can request changes",
        });
      }

      if (isAssignedUser) {
        return res.status(403).json({
          message:
            "You cannot review your own task",
        });
      }

      task.reviewedAt = new Date();
      task.reviewedBy = req.user.userId;
      task.reviewComment = comment || null;
    }

    // 7. Waiting for client
    if (status === "WAITING_FOR_CLIENT") {
      if (
        !isAssignedUser &&
        !isManager &&
        !isAdmin
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to put this task on hold",
        });
      }
    }

    // 8. Update status
    task.status = status;

    if (status === "READY_FOR_REVIEW") {
      task.submittedAt = new Date();
    }

    await task.save();

    // 9. Create history record
    let action = "STATUS_CHANGED";

    if (status === "READY_FOR_REVIEW") {
      action = "TASK_SUBMITTED";
    }

    if (status === "COMPLETED") {
      action = "TASK_APPROVED";
    }

    if (status === "CHANGES_REQUESTED") {
      action = "CHANGES_REQUESTED";
    }

    if (status === "WAITING_FOR_CLIENT") {
      action = "WAITING_FOR_CLIENT";
    }

    await TaskHistory.create({
      task: task._id,
      user: req.user.userId,
      action,
      fromStatus: oldStatus,
      toStatus: status,
      comment: comment || null,
    });

    // 10. Response
    res.status(200).json({
      message:
        "Task status updated successfully",
      task,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// import Task from "../models/task.model.js";
// import TaskHistory from "../models/taskHistory.model.js";

// import {
//   isValidTransition
// } from "../services/taskWorkflowService.js";


// export const updateTaskStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, comment } = req.body;

   
//     // 1. Validate status

//     const validStatuses = [
//       "NOT_STARTED",
//       "IN_PROGRESS",
//       "WAITING_FOR_CLIENT",
//       "READY_FOR_REVIEW",
//       "CHANGES_REQUESTED",
//       "COMPLETED"
//     ];

//     if (!status || !validStatuses.includes(status)) {
//       return res.status(400).json({
//         message: "Invalid task status"
//       });
//     }

//     // 2. Find task

//     const task = await Task.findById(id);

//     if (!task) {
//       return res.status(404).json({
//         message: "Task not found"
//       });
//     }

   
//     // 3. Check workflow transition

//     const oldStatus = task.status;

//     if (!isValidTransition(oldStatus, status)) {
//       return res.status(400).json({
//         message:
//           `Invalid workflow transition: ${oldStatus} → ${status}`
//       });
//     }

 
//     // 4. Authorization

//     const isAssignedUser =
//       task.assignedTo.toString() === req.user.userId;

//     const isManager =
//       req.user.role === "MANAGER";

//     const isAdmin =
//       req.user.role === "ADMIN";

//     /*
//       Team members can update only
//       their own tasks.
//     */

//     if (
//       req.user.role === "TEAM_MEMBER" &&
//       !isAssignedUser
//     ) {
//       return res.status(403).json({
//         message: "You can only update your own tasks"
//       });
//     }

 
//     // 5. Manager approval

//     if (status === "COMPLETED") {

//       if (!isManager && !isAdmin) {
//         return res.status(403).json({
//           message:
//             "Only a manager or admin can complete a task"
//         });
//       }

//       /*
//         A manager cannot approve
//         their own work.
//       */

//       if (isAssignedUser) {
//         return res.status(403).json({
//           message:
//             "You cannot approve your own task"
//         });
//       }

//       task.reviewedAt = new Date();
//       task.reviewedBy = req.user.userId;
//       task.reviewComment = comment || null;
//     }

//     // 6. Changes requested

//     if (status === "CHANGES_REQUESTED") {

//       if (!isManager && !isAdmin) {
//         return res.status(403).json({
//           message:
//             "Only a manager or admin can request changes"
//         });
//       }

//       if (isAssignedUser) {
//         return res.status(403).json({
//           message:
//             "You cannot review your own task"
//         });
//       }

//       task.reviewedAt = new Date();
//       task.reviewedBy = req.user.userId;
//       task.reviewComment = comment || null;
//     }


//     // 7. Waiting for client

//     if (status === "WAITING_FOR_CLIENT") {

//       if (!isAssignedUser && !isManager && !isAdmin) {
//         return res.status(403).json({
//           message:
//             "You are not authorized to put this task on hold"
//         });
//       }
//     }

//     // 8. Update status

//     task.status = status;

//     // If task is submitted for review
//     if (status === "READY_FOR_REVIEW") {
//       task.submittedAt = new Date();
//     }

//     await task.save();

//     // 9. Create history record

//     let action = "STATUS_CHANGED";

//     if (status === "READY_FOR_REVIEW") {
//       action = "TASK_SUBMITTED";
//     }

//     if (status === "COMPLETED") {
//       action = "TASK_APPROVED";
//     }

//     if (status === "CHANGES_REQUESTED") {
//       action = "CHANGES_REQUESTED";
//     }

//     if (status === "WAITING_FOR_CLIENT") {
//       action = "WAITING_FOR_CLIENT";
//     }

//     await TaskHistory.create({
//       task: task._id,
//       user: req.user.userId,
//       action,
//       fromStatus: oldStatus,
//       toStatus: status,
//       comment: comment || null
//     });


//     // 10. Response

//     res.status(200).json({
//       message: "Task status updated successfully",
//       task
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };