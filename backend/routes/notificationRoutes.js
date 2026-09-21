import express from "express";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

import {
  authenticate,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  getNotifications
);

router.patch(
  "/:id/read",
  authenticate,
  markNotificationAsRead
);

router.patch(
  "/read-all",
  authenticate,
  markAllNotificationsAsRead
);

export default router;