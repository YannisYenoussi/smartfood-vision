import axios from "axios";
import { AnalysisResponse } from "../types/analysis";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const analyzeImage = async (imageUrl: string): Promise<AnalysisResponse> => {
  try {
    const response = await api.post<AnalysisResponse>("/api/analyze", {
      imageUrl,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      throw new Error(`Analysis failed: ${message}`);
    }
    throw error;
  }
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get("/api/health");
    return response.data.status === "ok";
  } catch {
    return false;
  }
};
