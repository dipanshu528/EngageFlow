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

