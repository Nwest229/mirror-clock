"use client";

import { useState } from "react";
import { SetupConfig, TableShape } from "@/types";
import Button from "@/components/ui/Button";

interface SetupScreenProps {
  onSubmit: (config: SetupConfig) => void;
}

export default function SetupScreen({ onSubmit }: SetupScreenProps) {
  const [namesText, setNamesText] = useState("");
  const [tableCount, setTableCount] = useState(2);
  const [seatsPerTable, setSeatsPerTable] = useState(6);
  const [tableShape, setTableShape] = useState<TableShape>("round");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const names = namesText
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);

    if (names.length === 0) {
      setError("Entrez au moins un nom.");
      return;
    }
    if (tableCount < 1 || seatsPerTable < 1) {
      setError("Le nombre de tables et de places doit être supérieur à 0.");
      return;
    }
    setError("");
    onSubmit({ names, tableCount, seatsPerTable, tableShape });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Plan de table</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Liste des noms <span className="text-gray-400 font-normal">(un par ligne)</span>
            </label>
            <textarea
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              rows={8}
              placeholder={"Alice\nBob\nCharlie\n..."}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            {namesText.trim() && (
              <p className="text-xs text-gray-400 mt-1">
                {namesText.split("\n").filter((n) => n.trim()).length} personnes
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de tables
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={tableCount}
                onChange={(e) => setTableCount(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Places par table
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={seatsPerTable}
                onChange={(e) => setSeatsPerTable(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forme des tables
            </label>
            <div className="flex gap-3">
              {(["round", "rectangular"] as TableShape[]).map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => setTableShape(shape)}
                  className={`flex-1 rounded-xl border-2 py-3 text-sm font-medium transition-colors ${
                    tableShape === shape
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {shape === "round" ? "⬤  Ronde" : "▬  Rectangulaire"}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full py-3">
            Créer le plan de table →
          </Button>
        </form>
      </div>
    </div>
  );
}
