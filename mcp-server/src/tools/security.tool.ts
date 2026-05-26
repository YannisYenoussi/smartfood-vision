import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { foodListSchema, sanitizeFoodName } from "../security/inputValidation.js";
import { ZodError } from "zod";

/**
 * Caloric database
 */
const CALORIE_DATABASE: Record<string, number> = {
  riz: 130,
  pâtes: 131,
  pain: 265,
  poulet: 165,
  poisson: 82,
  saumon: 208,
  œufs: 155,
  fromage: 402,
  brocoli: 34,
  salade: 15,
  tomate: 18,
  oignon: 40,
  beurre: 717,
  huile: 884,
  pizza: 285,
  burger: 250,
  frites: 365,
  bacon: 541,
  banane: 89,
  pomme: 52,
  orange: 47,
  citron: 29,
  café: 0,
  thé: 0,
  eau: 0,
};

/**
 * Tool: estimate_nutrition_from_labels
 * Type: Action
 * Description: Estimates nutritional content from a list of food names
 */
export const estimateNutritionFromLabelsTool: Tool = {
  name: "estimate_nutrition_from_labels",
  description:
    "Estimates caloric content from a list of food item names. Useful for manual food entry or validation.",
  inputSchema: {
    type: "object" as const,
    properties: {
      foods: {
        type: "array" as const,
        items: {
          type: "string" as const,
        },
        description: "Array of food item names to estimate nutrition for",
      },
    },
    required: ["foods"],
  },
};

function estimateCalories(foodName: string): number {
  const lower = foodName.toLowerCase();

  // Check exact match first
  if (lower in CALORIE_DATABASE) {
    return CALORIE_DATABASE[lower];
  }

  // Heuristic estimation
  if (
    lower.includes("légume") ||
    lower.includes("fruit") ||
    lower.includes("salade")
  ) {
    return 40;
  }
  if (lower.includes("viande") || lower.includes("poisson") || lower.includes("œuf")) {
    return 150;
  }
  if (lower.includes("pain") || lower.includes("pâte") || lower.includes("riz")) {
    return 130;
  }

  // Default estimate
  return 100;
}

export function executeEstimateNutrition(input: { foods: string[] }): object {
  try {
    // Validate input
    const validatedInput = foodListSchema.parse(input);

    // Sanitize and estimate calories
    const nutritionDetails = validatedInput.foods.map((food) => {
      const sanitized = sanitizeFoodName(food);
      const calories = estimateCalories(sanitized);
      return {
        food: sanitized,
        estimated_calories_per_100g: calories,
      };
    });

    // Calculate averages
    const totalCalories = nutritionDetails.reduce((sum, item) => sum + item.estimated_calories_per_100g, 0);
    const averageCalories = Math.round(totalCalories / nutritionDetails.length);

    return {
      status: "success",
      food_count: validatedInput.foods.length,
      average_calories_per_100g: averageCalories,
      breakdown: nutritionDetails,
      estimation_note:
        "These are approximations based on standard nutritional databases. Actual values depend on preparation method and portion size.",
      disclaimer:
        "This estimation is for informational purposes only and should not be used as a substitute for professional nutritional advice.",
    };
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

    return {
      error: "Estimation failed",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
