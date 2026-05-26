import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { SmartfoodApiService } from "../services/smartfoodApi.service.js";
import { analyzeFoodImageSchema, sanitizeInput } from "../security/inputValidation.js";
import { ZodError } from "zod";

const apiService = new SmartfoodApiService();

/**
 * Tool: analyze_food_image
 * Type: Action
 * Description: Analyzes a food image from URL
 */
export const analyzeFoodImageTool: Tool = {
  name: "analyze_food_image",
  description:
    "Analyzes a food image from a public URL. Detects food items, estimates calories, and provides nutritional insights.",
  inputSchema: {
    type: "object" as const,
    properties: {
      imageUrl: {
        type: "string" as const,
        description: "Public HTTP/HTTPS URL pointing to a food image",
      },
      language: {
        type: "string" as const,
        enum: ["fr", "en"],
        description: "Language for response (fr=French, en=English)",
      },
    },
    required: ["imageUrl"],
  },
};

export async function executeAnalyzeFoodImage(input: {
  imageUrl: string;
  language?: string;
}): Promise<object> {
  try {
    // Validate input using Zod
    const validatedInput = analyzeFoodImageSchema.parse(input);

    // Call backend API
    const analysis = await apiService.analyzeImage(validatedInput.imageUrl);

    // Format response in requested language
    const language = validatedInput.language || "fr";

    if (language === "en") {
      return {
        status: "success",
        source: analysis.source,
        detected_items: analysis.detectedItems.map((item) => ({
          name: item.label,
          confidence: `${(item.confidence * 100).toFixed(1)}%`,
        })),
        nutrition: {
          average_calories_per_100g: analysis.nutrition.estimatedCaloriesPer100g,
          breakdown: analysis.nutrition.details.map((d) => ({
            food: d.food,
            calories_per_100g: d.estimatedCaloriesPer100g,
          })),
        },
        summary: analysis.summary,
        warning: analysis.warning,
      };
    } else {
      // French response (default)
      return {
        statut: "succès",
        source: analysis.source,
        aliments_détectés: analysis.detectedItems.map((item) => ({
          nom: item.label,
          confiance: `${(item.confidence * 100).toFixed(1)}%`,
        })),
        nutrition: {
          calories_moyennes_pour_100g: analysis.nutrition.estimatedCaloriesPer100g,
          détail: analysis.nutrition.details.map((d) => ({
            aliment: d.food,
            calories_pour_100g: d.estimatedCaloriesPer100g,
          })),
        },
        résumé: analysis.summary,
        avertissement: analysis.warning,
      };
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: "Validation failed",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      };
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      error: "Analysis failed",
      message: sanitizeInput(message),
    };
  }
}
