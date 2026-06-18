"use client";

import { useState } from "react";
import { Gender, SetupConfig, TableShape } from "@/types";
import Button from "@/components/ui/Button";

interface SetupScreenProps {
  onSubmit: (config: SetupConfig) => void;
}

export default function SetupScreen({ onSubmit }: SetupScreenProps) {
  const [girlsText, setGirlsText] = useState("");
  const [boysText,  setBoysText]  = useState("");

  // String inputs so the user can clear and retype freely (e.g. "2" → "" → "6")
  const [tableCountStr,   setTableCountStr]   = useState("2");
  const [defaultSeatsStr, setDefaultSeatsStr] = useState("6");
  const [tableSeats,      setTableSeats]      = useState<number[]>([6, 6]);
  const [tableShape,      setTableShape]      = useState<TableShape>("round");
  const [error,           setError]           = useState("");

  // Derived valid numbers used in logic — fall back to 1 if input is empty/invalid
  const tableCountNum   = Math.max(1, Math.min(20, parseInt(tableCountStr)   || 0));
  const defaultSeatsNum = Math.max(1, Math.min(30, parseInt(defaultSeatsStr) || 0));

  const girlCount  = girlsText.split("\n").filter(n => n.trim()).length;
  const boyCount   = boysText.split("\n").filter(n => n.trim()).length;
  const totalCount = (girlsText.trim() ? girlCount : 0) + (boysText.trim() ? boyCount : 0);

  function handleTableCountChange(val: string) {
    setTableCountStr(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= 1 && n <= 20) {
      setTableSeats(prev => {
        const next = [...prev];
        while (next.length < n) next.push(defaultSeatsNum);
        return next.slice(0, n);
      });
    }
  }

  function handleDefaultSeatsChange(val: string) {
    setDefaultSeatsStr(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= 1 && n <= 30) {
      setTableSeats(Array(tableCountNum).fill(n));
    }
  }

  function setSeat(i: number, n: number) {
    const v = Math.max(1, Math.min(30, n));
    setTableSeats(prev => prev.map((s, idx) => idx === i ? v : s));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const girls  = girlsText.split("\n").map(n => n.trim()).filter(Boolean).map(name => ({ name, gender: "F" as Gender }));
    const boys   = boysText.split("\n").map(n => n.trim()).filter(Boolean).map(name => ({ name, gender: "M" as Gender }));
    const people = [...girls, ...boys];

    if (people.length === 0) { setError("Entrez au moins un nom."); return; }
    if (tableCountNum < 1)   { setError("Il faut au moins une table."); return; }

    setError("");
    // Ensure seats array length matches tableCountNum, padding with defaultSeatsNum if needed
    const seats = Array.from({ length: tableCountNum }, (_, i) => tableSeats[i] ?? defaultSeatsNum);
    onSubmit({ people, tableCount: tableCountNum, seatsPerTable: seats, tableShape });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Plan de table</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Names */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-pink-600 mb-1">♀ Filles</label>
              <textarea
                value={girlsText}
                onChange={e => setGirlsText(e.target.value)}
                rows={6}
                placeholder={"Alice\nMarie\n..."}
                className="w-full rounded-lg border border-pink-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              />
              {girlsText.trim() && <p className="text-xs text-pink-400 mt-0.5">{girlCount} fille{girlCount > 1 ? "s" : ""}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-600 mb-1">♂ Garçons</label>
              <textarea
                value={boysText}
                onChange={e => setBoysText(e.target.value)}
                rows={6}
                placeholder={"Bob\nCharles\n..."}
                className="w-full rounded-lg border border-sky-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
              />
              {boysText.trim() && <p className="text-xs text-sky-400 mt-0.5">{boyCount} garçon{boyCount > 1 ? "s" : ""}</p>}
            </div>
          </div>
          {totalCount > 0 && <p className="text-xs text-gray-400 -mt-2">{totalCount} personnes au total</p>}

          {/* Table count + default seats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de tables</label>
              <input
                type="text"
                inputMode="numeric"
                value={tableCountStr}
                onChange={e => handleTableCountChange(e.target.value)}
                onBlur={() => setTableCountStr(String(tableCountNum))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Places par défaut</label>
              <input
                type="text"
                inputMode="numeric"
                value={defaultSeatsStr}
                onChange={e => handleDefaultSeatsChange(e.target.value)}
                onBlur={() => setDefaultSeatsStr(String(defaultSeatsNum))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Per-table seat count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Places par table</label>
            <div className="grid grid-cols-2 gap-2">
              {tableSeats.map((seats, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-2">
                  <span className="text-xs text-gray-500 w-6 shrink-0">T{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => setSeat(i, seats - 1)}
                    disabled={seats <= 1}
                    className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-600 text-sm font-bold flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors shrink-0"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-sm font-semibold text-gray-800">{seats}</span>
                  <button
                    type="button"
                    onClick={() => setSeat(i, seats + 1)}
                    disabled={seats >= 30}
                    className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-600 text-sm font-bold flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Table shape */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forme des tables</label>
            <div className="flex gap-3">
              {(["round", "rectangular"] as TableShape[]).map(shape => (
                <button
                  key={shape} type="button"
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
