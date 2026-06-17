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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const personById = Object.fromEntries(state.people.map((p) => [p.id, p]));
  const assignedIds = new Set(
    state.tables.flatMap((t) => t.seats.map((s) => s.occupantId)).filter(Boolean)
  );
  const unassignedPeople = state.people.filter((p) => !assignedIds.has(p.id));

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id);
    if (id.startsWith("person-")) {
      const personId = id.slice("person-".length);
      setActivePerson(personById[personId] ?? null);
    } else if (id.startsWith("seat-")) {
      // "seat-seat-table-X-Y" — the actual seat id is everything after first "seat-"
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
      const personId = activeId.slice("person-".length);
      dispatch({ type: "ASSIGN_TO_SEAT", personId, targetSeatId });
    } else if (activeId.startsWith("seat-")) {
      const sourceSeatId = activeId.slice("seat-".length);
      dispatch({ type: "MOVE_TO_SEAT", sourceSeatId, targetSeatId });
    }
  }

  const total = state.people.length;
  const placed = total - unassignedPeople.length;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Button variant="secondary" onClick={onReset} className="shrink-0">
            ← Retour
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-gray-900 truncate">Plan de table</h1>
            <p className="text-xs text-gray-400">
              {placed}/{total} placés · {state.tables.length} table{state.tables.length > 1 ? "s" : ""} · {state.config?.seatsPerTable} places
            </p>
          </div>
        </header>

        {/* Mobile unassigned bar */}
        <div className="md:hidden px-4 py-3 bg-white border-b border-gray-100">
          <UnassignedPanel people={unassignedPeople} />
        </div>

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-gray-200 bg-white p-4 overflow-y-auto">
            <UnassignedPanel people={unassignedPeople} />
          </aside>

          {/* Tables area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <TablesGrid tables={state.tables} people={state.people} />
          </main>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activePerson ? (
          <PersonChip draggableId="overlay" name={activePerson.name} isDragOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
