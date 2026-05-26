import axios from "axios";
import { AnalysisResponse } from "../types/analysis.js";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export class SmartfoodApiService {
  private client = axios.create({
    baseURL: BACKEND_URL,
    timeout: 30000,
  });

  async analyzeImage(imageUrl: string): Promise<AnalysisResponse> {
    try {
      const response = await this.client.post<AnalysisResponse>("/api/analyze", {
        imageUrl,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Backend error: ${error.response?.data?.error || error.message}`
        );
      }
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.client.get("/api/health");
      return response.data.status === "ok";
    } catch {
      return false;
    }
  }
}
