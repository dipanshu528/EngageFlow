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


app.use(cors({
    origin: "https://wondrous-pegasus-6ad5d51.netlify.app",
  methods: ["GET","POST", "PATCH", "PUT", "DELETE"],  
  credentials: true
 }
 ));
// app.use(cors());
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

