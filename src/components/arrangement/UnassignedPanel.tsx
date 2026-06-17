"use client";

import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { Gender, Person } from "@/types";
import PersonChip from "./PersonChip";

export const UNASSIGNED_DROP_ID = "unassigned-panel";

interface UnassignedPanelProps {
  people: Person[];
  onAdd?: () => void;
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

export default function UnassignedPanel({ people, onAdd }: UnassignedPanelProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const { setNodeRef, isOver } = useDroppable({ id: UNASSIGNED_DROP_ID });

  const girlCount = people.filter(p => p.gender === "F").length;
  const boyCount  = people.filter(p => p.gender === "M").length;

  const counts: Record<Filter, number> = { all: people.length, F: girlCount, M: boyCount };
  const visible = filter === "all" ? people : people.filter(p => p.gender === (filter as Gender));

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-2 rounded-xl transition-colors ${isOver ? "bg-indigo-50 ring-2 ring-indigo-300 ring-inset p-1 -m-1" : ""}`}
    >
      {/* Header + count + add button */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">Non placés</span>
        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
          {people.length}
        </span>
        {onAdd && (
          <button
            onClick={onAdd}
            className="ml-auto shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors text-sm font-bold leading-none"
            title="Ajouter une personne"
          >
            +
          </button>
        )}
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
