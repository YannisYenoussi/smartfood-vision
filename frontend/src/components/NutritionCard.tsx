import React from "react";
import { Nutrition } from "../types/analysis";

interface NutritionCardProps {
  nutrition: Nutrition;
  summary: string;
  warning: string;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({
  nutrition,
  summary,
  warning,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🥗 Nutrition</h2>

      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200 mb-4">
        <p className="text-sm text-gray-600 mb-1">Calories moyennes (par 100g)</p>
        <p className="text-3xl font-bold text-orange-600">
          {nutrition.estimatedCaloriesPer100g}
          <span className="text-lg ml-1">kcal</span>
        </p>
      </div>

      {nutrition.details.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Détail par aliment</h3>
          <div className="space-y-2">
            {nutrition.details.map((detail, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-700">
                <span>{detail.food}</span>
                <span className="font-semibold">{detail.estimatedCaloriesPer100g} kcal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
        <p className="text-sm text-gray-800">
          <span className="font-semibold">📝 Résumé:</span> {summary}
        </p>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <p className="text-xs text-gray-700">
          <span className="font-semibold">⚠️ Avertissement:</span> {warning}
        </p>
      </div>
    </div>
  );
};
