import express from "express";

import {
  getTasks,
  getTaskById,
  updateTaskStatus
} from "../controllers/taskController.js";

import {
  getTaskHistory
} from "../controllers/taskHistoryController.js";

import {
  authenticate
} from "../middleware/authMiddleware.js";

const router = express.Router();


// Get all tasks
router.get(
  "/",
  authenticate,
  getTasks
);


// Get task history
// IMPORTANT: Keep this BEFORE /:id
router.get(
  "/:id/history",
  authenticate,
  getTaskHistory
);


// Get single task
router.get(
  "/:id",
  authenticate,
  getTaskById
);


// Update task status
router.patch(
  "/:id/status",
  authenticate,
  updateTaskStatus
);

export default router;







// import express from "express";

// import {
//   getTasks,
//   getTaskById,
//   updateTaskStatus
// } from "../controllers/taskController.js";

// import {
//   authenticate
// } from "../middleware/authMiddleware.js";

// const router = express.Router();


// // Get all tasks
// router.get(
//   "/",
//   authenticate,
//   getTasks
// );


// // Get single task
// router.get(
//   "/:id",
//   authenticate,
//   getTaskById
// );


// // Update task status
// router.patch(
//   "/:id/status",
//   authenticate,
//   updateTaskStatus
// );


// export default router;








// import express from "express";

// import {
//   updateTaskStatus
// } from "../controllers/taskController.js";

// import {
//   authenticate
// } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.patch(
//   "/:id/status",
//   authenticate,
//   updateTaskStatus
// );

// export default router;