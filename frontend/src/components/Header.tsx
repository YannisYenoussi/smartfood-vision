import React from "react";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>🍽️</span>
          SmartFood Vision
        </h1>
        <p className="text-green-100 mt-1">Analysez vos repas avec l'IA</p>
      </div>
    </header>
  );
};
