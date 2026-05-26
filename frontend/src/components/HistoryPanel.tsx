import React from "react";
import { HistoryEntry } from "../types/analysis";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">📋 Historique</h2>
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:text-red-700 font-semibold"
        >
          Effacer
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={entry.imageUrl}
                alt="History item"
                className="w-12 h-12 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {entry.analysis.detectedItems
                    .map((item) => item.label)
                    .join(", ") || "Analyse sans résultat"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
