import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",")
      : "*",
    credentials: false,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Visitor Pass API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "visitor-pass-api",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/activity", activityRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// MongoDB connection
await connectDB();

// Local development only
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}

export default app;