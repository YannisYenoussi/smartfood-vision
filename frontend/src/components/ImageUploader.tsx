import React, { useState } from "react";

interface ImageUploaderProps {
  onImageSelected: (url: string) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  isLoading,
}) => {
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");

    if (!urlInput.trim()) {
      setUrlError("Veuillez entrer une URL");
      return;
    }

    try {
      new URL(urlInput);
      onImageSelected(urlInput);
      setUrlInput("");
    } catch {
      setUrlError("URL invalide");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        📤 Importer une image
      </h2>

      <form onSubmit={handleUrlSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de l'image
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUrlError("");
              }}
              placeholder="https://exemple.com/image.jpg"
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !urlInput.trim()}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? "⏳ Analyse..." : "Analyser"}
            </button>
          </div>
          {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
        </div>
      </form>

      <p className="text-sm text-gray-500 text-center">
        💡 Collez l'URL complète d'une image (JPG, PNG, WebP)
      </p>
    </div>
  );
};
