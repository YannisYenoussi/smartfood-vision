import { Nutrition, NutritionDetail } from "../types/analysis.js";

// Database of common food items with calorie estimates per 100g
const foodCalorieDatabase: Record<string, number> = {
  // Grains
  riz: 130,
  "riz blanc": 130,
  "riz brun": 111,
  pâtes: 131,
  pain: 265,
  "pain grillé": 265,

  // Proteins
  poulet: 165,
  "poulet grillé": 165,
  poisson: 82,
  "poisson blanc": 82,
  saumon: 208,
  œufs: 155,
  fromage: 402,

  // Vegetables
  brocoli: 34,
  salade: 15,
  "salade verte": 15,
  tomate: 18,
  oignon: 40,
  citron: 29,

  // Fruits
  banane: 89,
  pomme: 52,
  orange: 47,

  // Fats & Oils
  beurre: 717,
  "huile d'olive": 884,
  huile: 884,

  // Prepared foods
  pizza: 285,
  burger: 250,
  frites: 365,
  "frites": 365,

  // Other
  sauce: 50,
  "sauce soja": 53,
  bacon: 541,
};

export class NutritionService {
  /**
   * Estimate nutrition information from detected food items
   */
  estimateNutrition(detectedItems: Array<{ label: string }>): Nutrition {
    const details: NutritionDetail[] = [];
    let totalCalories = 0;

    for (const item of detectedItems) {
      if (!item || !item.label) continue;
      
      const caloriesPer100g =
        foodCalorieDatabase[item.label.toLowerCase()] ||
        this.estimateCalories(item.label);

      details.push({
        food: item.label,
        estimatedCaloriesPer100g: caloriesPer100g,
      });

      totalCalories += caloriesPer100g;
    }

    const averageCalories = Math.round(totalCalories / Math.max(details.length, 1));

    return {
      estimatedCaloriesPer100g: averageCalories,
      details: details,
    };
  }

  /**
   * Generate a summary of the analysis
   */
  generateSummary(detectedItems: Array<{ label: string }>): string {
    if (detectedItems.length === 0) {
      return "Aucun aliment détecté dans l'image.";
    }

    const itemLabels = detectedItems.map((item) => item.label).join(", ");
    return `L'image semble contenir ${itemLabels}.`;
  }

  /**
   * Get the security warning
   */
  getWarning(): string {
    return "Cette estimation nutritionnelle est approximative et basée sur le contenu visuel. Elle ne remplace pas une analyse nutritionnelle professionnelle ou un avis médical.";
  }

  /**
   * Heuristic to estimate calories for unknown foods
   */
  private estimateCalories(foodLabel: string): number {
    const lower = foodLabel.toLowerCase();

    // Vegetables are typically low calorie
    if (lower.includes("légume") || lower.includes("fruit") || lower.includes("salade")) {
      return 40;
    }

    // Proteins are typically medium-high
    if (
      lower.includes("viande") ||
      lower.includes("poisson") ||
      lower.includes("œuf")
    ) {
      return 150;
    }

    // Grains are typically medium
    if (lower.includes("pain") || lower.includes("pâte") || lower.includes("riz")) {
      return 130;
    }

    // Default estimate
    return 100;
  }
}
