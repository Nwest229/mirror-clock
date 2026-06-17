"use client";

import { useState } from "react";
import { Gender, Person } from "@/types";
import PersonChip from "./PersonChip";

interface UnassignedPanelProps {
  people: Person[];
}

type Filter = "all" | "F" | "M";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "F",   label: "♀ Filles" },
  { value: "M",   label: "♂ Garçons" },
];

function filterColor(f: Filter, active: boolean) {
  if (!active) return "bg-gray-100 text-gray-500";
  if (f === "F") return "bg-pink-100 text-pink-700";
  if (f === "M") return "bg-sky-100 text-sky-700";
  return "bg-gray-200 text-gray-800";
}

export default function UnassignedPanel({ people }: UnassignedPanelProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const girlCount = people.filter(p => p.gender === "F").length;
  const boyCount  = people.filter(p => p.gender === "M").length;

  const counts: Record<Filter, number> = { all: people.length, F: girlCount, M: boyCount };
  const visible = filter === "all" ? people : people.filter(p => p.gender === (filter as Gender));

  return (
    <div className="flex flex-col gap-2">
      {/* Header + count */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">Non placés</span>
        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
          {people.length}
        </span>
      </div>

      {/* Gender filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${filterColor(f.value, filter === f.value)}`}
          >
            {f.label}
            {counts[f.value] > 0 && (
              <span className="ml-1 opacity-70">{counts[f.value]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {visible.length === 0 ? (
          <p className="text-sm text-gray-400 italic shrink-0">
            {people.length === 0 ? "Tout le monde est placé ✓" : "Aucun dans ce groupe"}
          </p>
        ) : (
          visible.map(person => (
            <PersonChip key={person.id} draggableId={`person-${person.id}`} name={person.name} gender={person.gender} />
          ))
        )}
      </div>

      {/* Desktop: vertical list */}
      <div className="hidden md:flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-220px)]">
        {visible.length === 0 ? (
          <p className="text-sm text-gray-400 italic">
            {people.length === 0 ? "Tout le monde est placé ✓" : "Aucun dans ce groupe"}
          </p>
        ) : (
          visible.map(person => (
            <PersonChip key={person.id} draggableId={`person-${person.id}`} name={person.name} gender={person.gender} />
          ))
        )}
      </div>
    </div>
  );
}
