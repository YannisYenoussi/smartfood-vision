import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool: get_application_capabilities
 * Type: Exploration
 * Description: Provides information about SmartFood Vision's available features
 */
export const getApplicationCapabilitiesTool: Tool = {
  name: "get_application_capabilities",
  description:
    "Presents the available capabilities of SmartFood Vision. Describes what the application can do, its features, and current limitations.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export function executeGetCapabilities(): object {
  return {
    application: "SmartFood Vision",
    version: "1.0.0",
    description:
      "AI-powered food image analyzer that detects food items, estimates nutritional content, and provides dietary insights.",
    features: [
      "Food item detection from images",
      "Confidence scoring for detected items",
      "Nutritional estimation (calories per 100g)",
      "Food summary generation",
      "Support for Azure Vision API and mock mode",
      "REST API backend",
      "Local analysis history",
    ],
    capabilities: {
      image_analysis: {
        description: "Analyze food images to detect items and nutrition",
        supported_formats: ["JPG", "JPEG", "PNG", "WebP"],
        max_image_size: "No strict limit at API level",
      },
      nutrition_estimation: {
        description: "Estimate caloric content of detected foods",
        accuracy: "Approximate (±15-20%)",
        based_on: "Visual detection and nutritional databases",
      },
    },
    limitations: [
      "Nutritional estimates are approximations only",
      "Accuracy depends on image quality and lighting",
      "Cannot detect all food types with equal accuracy",
      "Portion size estimation is not available",
      "Not a substitute for professional nutritional analysis",
    ],
    security_features: [
      "Input validation with Zod schemas",
      "No local file access",
      "No system command execution",
      "Prompt injection protection",
      "Rate limiting recommended for production",
    ],
  };
}
