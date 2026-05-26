import { DetectedItem } from "../types/analysis.js";

// Realistic mock food analysis data
const mockDatasets = [
  {
    name: "Asian Plate",
    items: [
      { label: "riz blanc", confidence: 0.92 },
      { label: "poulet grillé", confidence: 0.87 },
      { label: "brocoli", confidence: 0.85 },
      { label: "sauce soja", confidence: 0.76 },
    ],
  },
  {
    name: "Pizza & Salad",
    items: [
      { label: "pizza", confidence: 0.94 },
      { label: "tomate", confidence: 0.88 },
      { label: "fromage", confidence: 0.91 },
      { label: "salade verte", confidence: 0.83 },
    ],
  },
  {
    name: "Pasta Dinner",
    items: [
      { label: "pâtes", confidence: 0.93 },
      { label: "poisson blanc", confidence: 0.89 },
      { label: "citron", confidence: 0.82 },
      { label: "huile d'olive", confidence: 0.71 },
    ],
  },
  {
    name: "Burger Meal",
    items: [
      { label: "burger", confidence: 0.96 },
      { label: "frites", confidence: 0.91 },
      { label: "oignon", confidence: 0.78 },
      { label: "salade", confidence: 0.85 },
    ],
  },
  {
    name: "Breakfast",
    items: [
      { label: "œufs", confidence: 0.93 },
      { label: "bacon", confidence: 0.88 },
      { label: "pain grillé", confidence: 0.85 },
      { label: "beurre", confidence: 0.82 },
    ],
  },
];

export class MockVisionService {
  async analyzeImageFromUrl(_imageUrl: string): Promise<DetectedItem[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return random mock dataset
    const randomDataset =
      mockDatasets[Math.floor(Math.random() * mockDatasets.length)];
    return randomDataset.items;
  }
}
