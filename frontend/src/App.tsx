import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { ResultCard } from "./components/ResultCard";
import { NutritionCard } from "./components/NutritionCard";
import { HistoryPanel } from "./components/HistoryPanel";
import { analyzeImage, checkHealth } from "./services/api";
import { AnalysisResponse, HistoryEntry } from "./types/analysis";
import "./index.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [backendStatus, setBackendStatus] = useState<boolean>(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("smartfood-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        console.warn("Failed to load history");
      }
    }

    // Check backend health
    checkHealth().then(setBackendStatus);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("smartfood-history", JSON.stringify(history));
  }, [history]);

  const handleImageSelected = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setCurrentImageUrl(url);

    try {
      const result = await analyzeImage(url);
      setAnalysis(result);

      // Add to history
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        imageUrl: url,
        analysis: result,
        timestamp: new Date().toISOString(),
      };
      setHistory((prev) => [newEntry, ...prev].slice(0, 20)); // Keep last 20
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setCurrentImageUrl(entry.imageUrl);
    setAnalysis(entry.analysis);
  };

  const handleClearHistory = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer l'historique ?")) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!backendStatus && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              ⚠️ Le serveur backend n'est pas accessible. Vérifiez qu'il est lancé
              sur le port 3001.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <ImageUploader onImageSelected={handleImageSelected} isLoading={isLoading} />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">❌ Erreur: {error}</p>
              </div>
            )}

            {currentImageUrl && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  🖼️ Aperçu
                </h2>
                <img
                  src={currentImageUrl}
                  alt="Selected"
                  className="w-full h-auto object-cover rounded-lg border border-gray-200 max-h-96"
                  onError={(e) => {
                    setError("Impossible de charger l'image. Vérifiez l'URL.");
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {isLoading && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-600 font-semibold">Analyse en cours...</p>
              </div>
            )}

            {analysis && (
              <>
                <ResultCard
                  detectedItems={analysis.detectedItems}
                  source={analysis.source}
                />
                <NutritionCard
                  nutrition={analysis.nutrition}
                  summary={analysis.summary}
                  warning={analysis.warning}
                />
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <HistoryPanel
              history={history}
              onSelect={handleHistorySelect}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 text-sm">
            SmartFood Vision © 2024 - Analyse alimentaire par IA
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
