import express from "express";

import {
  getAssignableUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/get-assignable-users", getAssignableUsers);

export default router;