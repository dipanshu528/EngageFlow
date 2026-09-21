
import express from "express";

import {
  createTaskTemplate,
  getTaskTemplates,
  getTemplatesByService,
  updateTaskTemplate
} from "../controllers/taskTemplateController.js";

import {
  authenticate,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();


// CREATE TEMPLATE
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createTaskTemplate
);


// GET ALL TEMPLATES
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  getTaskTemplates
);


// GET TEMPLATES BY SERVICE
router.get(
  "/service/:serviceId",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  getTemplatesByService
);


// UPDATE TEMPLATE
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateTaskTemplate
);


export default router;