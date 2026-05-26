export interface DetectedItem {
  label: string;
  confidence: number;
}

export interface NutritionDetail {
  food: string;
  estimatedCaloriesPer100g: number;
}

export interface Nutrition {
  estimatedCaloriesPer100g: number;
  details: NutritionDetail[];
}

export interface AnalysisResponse {
  success: boolean;
  source: "azure" | "mock";
  detectedItems: DetectedItem[];
  nutrition: Nutrition;
  summary: string;
  warning: string;
}

export interface HistoryEntry {
  id: string;
  imageUrl: string;
  analysis: AnalysisResponse;
  timestamp: string;
}
