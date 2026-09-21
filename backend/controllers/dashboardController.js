import Task from "../models/task.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    let filter = {};

    // ADMIN and MANAGER can see all tasks
    if (
      req.user.role === "ADMIN" ||
      req.user.role === "MANAGER"
    ) {
      filter = {};
    }

    // TEAM_MEMBER can see only assigned tasks
    if (req.user.role === "TEAM_MEMBER") {
      filter.assignedTo = req.user.userId;
    }

    const today = new Date();

    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const [
      openTasks,
      dueToday,
      overdue,
      waitingForClient,
      waitingForReview,
      notStarted,
      inProgress,
      completed,
      changesRequested,
    ] = await Promise.all([
      // All tasks except completed
      Task.countDocuments({
        ...filter,
        status: { $ne: "COMPLETED" },
      }),

      // Due today
      Task.countDocuments({
        ...filter,
        dueDate: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
        status: { $ne: "COMPLETED" },
      }),

      // Overdue
      Task.countDocuments({
        ...filter,
        dueDate: { $lt: startOfToday },
        status: { $ne: "COMPLETED" },
      }),

      // Waiting for client
      Task.countDocuments({
        ...filter,
        status: "WAITING_FOR_CLIENT",
      }),

      // Ready for review
      Task.countDocuments({
        ...filter,
        status: "READY_FOR_REVIEW",
      }),

      // Not started
      Task.countDocuments({
        ...filter,
        status: "NOT_STARTED",
      }),

      // In progress
      Task.countDocuments({
        ...filter,
        status: "IN_PROGRESS",
      }),

      // Completed
      Task.countDocuments({
        ...filter,
        status: "COMPLETED",
      }),

      // Changes requested
      Task.countDocuments({
        ...filter,
        status: "CHANGES_REQUESTED",
      }),
    ]);

    res.status(200).json({
      stats: {
        openTasks,
        dueToday,
        overdue,
        waitingForClient,
        waitingForReview,
        notStarted,
        inProgress,
        completed,
        changesRequested,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};





// import Task from "../models/task.model.js";

// export const getDashboardStats = async (req, res) => {
//   try {
//     let filter = {};

//     if (
//       req.user.role === "ADMIN" ||
//       req.user.role === "MANAGER"
//     ) {
//       filter = {};
//     }

//     if (req.user.role === "TEAM_MEMBER") {
//       filter.assignedTo = req.user.userId;
//     }

//     const today = new Date();

//     const startOfToday = new Date(today);
//     startOfToday.setHours(0, 0, 0, 0);

//     const endOfToday = new Date(today);
//     endOfToday.setHours(23, 59, 59, 999);

//     const [
//       openTasks,
//       dueToday,
//       overdue,
//       waitingForClient,
//       waitingForReview,
//     ] = await Promise.all([
//       Task.countDocuments({
//         ...filter,
//         status: { $ne: "COMPLETED" },
//       }),

//       Task.countDocuments({
//         ...filter,
//         dueDate: {
//           $gte: startOfToday,
//           $lte: endOfToday,
//         },
//         status: { $ne: "COMPLETED" },
//       }),

//       Task.countDocuments({
//         ...filter,
//         dueDate: {
//           $lt: startOfToday,
//         },
//         status: { $ne: "COMPLETED" },
//       }),

//       Task.countDocuments({
//         ...filter,
//         status: "WAITING_FOR_CLIENT",
//       }),

//       Task.countDocuments({
//         ...filter,
//         status: "READY_FOR_REVIEW",
//       }),
//     ]);

//     res.status(200).json({
//       stats: {
//         openTasks,
//         dueToday,
//         overdue,
//         waitingForClient,
//         waitingForReview,
//       },
//     });

//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };







// import Task from "../models/task.model.js";

// export const getDashboardStats = async (req, res) => {
//   try {
//     let filter = {};

//     // Team members should only see statistics
//     // for their own tasks.
//     if (req.user.role === "TEAM_MEMBER") {
//       filter.assignedTo = req.user.userId;
//     }

//     const today = new Date();

//     const startOfToday = new Date(today);
//     startOfToday.setHours(0, 0, 0, 0);

//     const endOfToday = new Date(today);
//     endOfToday.setHours(23, 59, 59, 999);

//     const [
//       openTasks,
//       dueToday,
//       overdue,
//       waitingForClient,
//       waitingForReview,
//     ] = await Promise.all([
//       // All tasks that are not completed
//       Task.countDocuments({
//         ...filter,
//         status: { $ne: "COMPLETED" },
//       }),

//       // Tasks due today
//       Task.countDocuments({
//         ...filter,
//         dueDate: {
//           $gte: startOfToday,
//           $lte: endOfToday,
//         },
//         status: { $ne: "COMPLETED" },
//       }),

//       // Tasks whose due date has passed
//       Task.countDocuments({
//         ...filter,
//         dueDate: { $lt: startOfToday },
//         status: { $ne: "COMPLETED" },
//       }),

//       // Waiting for client
//       Task.countDocuments({
//         ...filter,
//         status: "WAITING_FOR_CLIENT",
//       }),

//       // Ready for manager review
//       Task.countDocuments({
//         ...filter,
//         status: "READY_FOR_REVIEW",
//       }),
//     ]);

//     res.status(200).json({
//       stats: {
//         openTasks,
//         dueToday,
//         overdue,
//         waitingForClient,
//         waitingForReview,
//       },
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };