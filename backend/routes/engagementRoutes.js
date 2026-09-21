import express from "express";

import {
  createEngagement,
   getEngagements,
} from "../controllers/engagementController.js";

import {
  authenticate,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  createEngagement
);


router.get(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  getEngagements
);


export default router;



