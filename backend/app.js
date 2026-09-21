import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import engagementRoutes from "./routes/engagementRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import taskTemplateRoutes from "./routes/taskTemplateRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Task Management API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/engagements", engagementRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/task-templates", taskTemplateRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;



// Step 4 — Then create Service Types

// After Client CRUD, we'll create:

// ServiceType

// Examples:

// Monthly Accounting
// Quarterly Tax Filing
// Annual Tax Return
// Payroll Processing

// API:

// POST   /api/services
// GET    /api/services
// GET    /api/services/:id
// PATCH  /api/services/:id
// Step 5 — Task Templates

// This is where the assignment becomes interesting.

// For example:

// Service: Monthly Accounting

// Templates:

// 1. Collect financial documents
// 2. Review transactions
// 3. Prepare monthly report
// 4. Manager review
// 5. Finalize report

// Then when you create an engagement for that service, the backend automatically creates these tasks.

// Step 6 — Engagement creation

// This is the main backend logic.

// For example:

// Client: ABC Pvt Ltd
// Service: Monthly Accounting
// Period: 2026-09
// Due Date: 30 Sep 2026

// Creating this engagement should automatically create:

// Task 1 → Collect financial documents
// Task 2 → Review transactions
// Task 3 → Prepare monthly report
// Task 4 → Manager review
// Task 5 → Finalize report

// We'll use a MongoDB transaction here.

// We'll also prevent:

// ABC + Monthly Accounting + 2026-09

// from being created twice.

// Step 7 — Task workflow

// Then implement:

// NOT_STARTED
//      ↓
// IN_PROGRESS
//      ↓
// READY_FOR_REVIEW
//      ↓
// COMPLETED

// And:

// IN_PROGRESS
//      ↓
// WAITING_FOR_CLIENT
//      ↓
// IN_PROGRESS

// and:

// READY_FOR_REVIEW
//      ↓
// CHANGES_REQUESTED
//      ↓
// IN_PROGRESS

// The backend must reject invalid transitions.

// Step 8 — Dashboard

// Finally backend:

// GET /api/dashboard

// will return things like:

// {
//   "openTasks": 12,
//   "overdueTasks": 3,
//   "dueToday": 2,
//   "waitingForClient": 4,
//   "waitingForReview": 3
// }
// So your immediate next task

// Let's finish Client CRUD first.

// You already have:

// POST /api/clients
// GET  /api/clients

// Next we'll add:

// GET /api/clients/:id
// PATCH /api/clients/:id
// DELETE /api/clients/:id

// Send me your current clientController.js and clientRoutes.js, and I'll give you the exact code to add, step by step.