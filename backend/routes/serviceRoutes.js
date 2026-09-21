import express from "express";

import {
  createService,
  getServices,
  getServiceById,
  updateService
} from "../controllers/serviceController.js";

import {
  authenticate,
  authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();


// CREATE SERVICE
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createService
);


// GET ALL SERVICES
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  getServices
);


// GET SERVICE BY ID
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  getServiceById
);


// UPDATE SERVICE
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateService
);


export default router;




// {
//     "message": "Service created successfully",
//     "service": {
//         "name": "Monthly Accounting",
//         "engagementType": "RECURRING",
//         "frequency": "MONTHLY",
//         "description": "Monthly accounting and financial reporting",
//         "isActive": true,
//         "_id": "6aacedd0507998b78b9262a5",
//         "createdAt": "2026-09-18T07:52:48.210Z",
//         "updatedAt": "2026-09-18T07:52:48.210Z",
//         "__v": 0
//     }
// }



// {
//     "message": "Service created successfully",
//     "service": {
//         "name": "Quarterly Tax Filing",
//         "engagementType": "RECURRING",
//         "frequency": "QUARTERLY",
//         "description": "Quarterly tax filing service",
//         "isActive": true,
//         "_id": "6aacee15507998b78b9262a6",
//         "createdAt": "2026-09-18T07:53:57.268Z",
//         "updatedAt": "2026-09-18T07:53:57.268Z",
//         "__v": 0
//     }
// }