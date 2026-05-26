import React from "react";
import { DetectedItem } from "../types/analysis";

interface ResultCardProps {
  detectedItems: DetectedItem[];
  source: "azure" | "mock";
}

export const ResultCard: React.FC<ResultCardProps> = ({ detectedItems, source }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">🔍 Aliments détectés</h2>
        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          Source: {source === "azure" ? "Azure Vision 🔷" : "Mode démo"}
        </span>
      </div>

      {detectedItems.length === 0 ? (
        <p className="text-gray-500">Aucun aliment détecté</p>
      ) : (
        <div className="space-y-3">
          {detectedItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100"
            >
              <span className="font-medium text-gray-800">{item.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${item.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-green-600 w-12">
                  {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
