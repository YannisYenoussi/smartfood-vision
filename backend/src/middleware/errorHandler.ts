import { Request, Response, NextFunction } from "express";
import { AnalysisError } from "../types/analysis.js";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code: string = "BAD_REQUEST"
  ) {
    super(message);
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDev = process.env.NODE_ENV === "development";

  if (err instanceof AppError) {
    const response: AnalysisError = {
      success: false,
      error: err.message,
      code: err.code,
    };
    res.status(err.statusCode).json(response);
  } else {
    console.error("Unexpected error:", err);
    const response: AnalysisError = {
      success: false,
      error: isDev ? err.message : "Internal server error",
      code: "INTERNAL_ERROR",
    };
    res.status(500).json(response);
  }
}
