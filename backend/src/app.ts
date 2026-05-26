import express, { Request, Response } from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysis.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check route
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "smartfood-backend",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", analysisRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    code: "NOT_FOUND",
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
