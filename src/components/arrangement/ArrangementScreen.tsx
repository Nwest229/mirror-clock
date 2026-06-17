"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { Action, AppState, Person } from "@/types";
import Button from "@/components/ui/Button";
import UnassignedPanel from "./UnassignedPanel";
import TablesGrid from "./TablesGrid";
import PersonChip from "./PersonChip";

interface ArrangementScreenProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  onReset: () => void;
}

export default function ArrangementScreen({ state, dispatch, onReset }: ArrangementScreenProps) {
  const [activePerson, setActivePerson] = useState<Person | null>(null);
  const [shareLabel, setShareLabel] = useState<"share" | "copied">("share");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 10 } })
  );

  const personById = Object.fromEntries(state.people.map((p) => [p.id, p]));
  const assignedIds = new Set(
    state.tables.flatMap((t) => t.seats.map((s) => s.occupantId)).filter(Boolean)
  );
  const unassignedPeople = state.people.filter((p) => !assignedIds.has(p.id));

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id);
    if (id.startsWith("person-")) {
      setActivePerson(personById[id.slice("person-".length)] ?? null);
    } else if (id.startsWith("seat-")) {
      const seatId = id.slice("seat-".length);
      const seat = state.tables.flatMap((t) => t.seats).find((s) => s.id === seatId);
      setActivePerson(seat?.occupantId ? (personById[seat.occupantId] ?? null) : null);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActivePerson(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const targetSeatId = String(over.id);

    if (activeId.startsWith("person-")) {
      dispatch({ type: "ASSIGN_TO_SEAT", personId: activeId.slice("person-".length), targetSeatId });
    } else if (activeId.startsWith("seat-")) {
      dispatch({ type: "MOVE_TO_SEAT", sourceSeatId: activeId.slice("seat-".length), targetSeatId });
    }
  }

  async function handleShare() {
    const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Mon plan de table", url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareLabel("copied");
        setTimeout(() => setShareLabel("share"), 2500);
      }
    } catch {}
  }

  const total = state.people.length;
  const placed = total - unassignedPeople.length;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
          <Button variant="secondary" onClick={onReset} className="shrink-0 text-xs px-3">
            ← Retour
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-gray-900 text-sm truncate">Plan de table</h1>
            <p className="text-xs text-gray-400">
              {placed}/{total} placés · {state.tables.length} table{state.tables.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleShare}
            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-indigo-50 text-indigo-600 px-3 py-2 text-xs font-medium hover:bg-indigo-100 transition-colors"
          >
            {shareLabel === "copied" ? "✓ Copié" : "↑ Partager"}
          </button>
        </header>

        <div className="md:hidden px-4 py-3 bg-white border-b border-gray-100">
          <UnassignedPanel people={unassignedPeople} />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-gray-200 bg-white p-4 overflow-y-auto">
            <UnassignedPanel people={unassignedPeople} />
          </aside>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <TablesGrid tables={state.tables} people={state.people} />
          </main>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activePerson ? (
          <PersonChip draggableId="overlay" name={activePerson.name} gender={activePerson.gender} isDragOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
