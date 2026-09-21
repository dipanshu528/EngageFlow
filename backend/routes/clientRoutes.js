import express from "express";

import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} from "../controllers/clientController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Only ADMIN can create clients
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createClient
);

// ADMIN and MANAGER can view clients
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  getClients
);



// GET CLIENT BY ID
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  getClientById
);


// UPDATE CLIENT
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateClient
);


// DELETE CLIENT
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteClient
);


export default router;



// manager - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWFjNTY1ZTY2M2FiZDQwNjEzNjlmODgiLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc4OTcxNDg1MiwiZXhwIjoxNzg5ODAxMjUyfQ.YEhQaqsm1rkoqEQ9FAiRQAwqikPuE888x4q12LMeSn8
// admin -- eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWFjNTcyNDY2M2FiZDQwNjEzNjlmODkiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3ODk3MTU0MzMsImV4cCI6MTc4OTgwMTgzM30.qqnGtcgbNdwC55UgcavbtvzAY_v1q_kR_26b3NVhNn4
// ABC ID -- 6aace0391126e05e1f48d03b