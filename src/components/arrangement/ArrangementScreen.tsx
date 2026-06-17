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
import TableView from "./TableView";
import PersonChip from "./PersonChip";
import AddPersonModal from "./AddPersonModal";
import PrintView from "./PrintView";
import { UNASSIGNED_DROP_ID } from "./UnassignedPanel";

interface ArrangementScreenProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  onReset: () => void;
}

export default function ArrangementScreen({ state, dispatch, onReset }: ArrangementScreenProps) {
  const [activePerson, setActivePerson] = useState<Person | null>(null);
  const [shareLabel, setShareLabel] = useState<"share" | "copied">("share");
  const [viewMode, setViewMode] = useState<"all" | "single">("all");
  const [tableIndex, setTableIndex] = useState(0);
  const [showAddPerson, setShowAddPerson] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    // delay: hold 250ms without moving to grab — lets quick swipes scroll freely
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
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
    const overId = String(over.id);

    // Drop back onto the unassigned panel → remove from seat
    if (overId === UNASSIGNED_DROP_ID) {
      if (activeId.startsWith("seat-")) {
        dispatch({ type: "UNASSIGN", seatId: activeId.slice("seat-".length) });
      }
      return;
    }

    if (activeId.startsWith("person-")) {
      dispatch({ type: "ASSIGN_TO_SEAT", personId: activeId.slice("person-".length), targetSeatId: overId });
    } else if (activeId.startsWith("seat-")) {
      dispatch({ type: "MOVE_TO_SEAT", sourceSeatId: activeId.slice("seat-".length), targetSeatId: overId });
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

  function handlePrint() {
    window.print();
  }

  const total = state.people.length;
  const placed = total - unassignedPeople.length;
  const currentTable = state.tables[Math.min(tableIndex, state.tables.length - 1)];

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="screen-only min-h-screen bg-gray-50 flex flex-col">

          {/* Header */}
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
            <Button variant="secondary" onClick={onReset} className="shrink-0 text-xs px-3">
              ← Retour
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-gray-900 text-sm truncate">Plan de table</h1>
              <p className="text-xs text-gray-400">{placed}/{total} placés</p>
            </div>
            <button
              onClick={handlePrint}
              className="shrink-0 rounded-lg bg-gray-100 text-gray-600 px-3 py-2 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              ⎙ PDF
            </button>
            <button
              onClick={handleShare}
              className="shrink-0 rounded-lg bg-indigo-50 text-indigo-600 px-3 py-2 text-xs font-medium hover:bg-indigo-100 transition-colors"
            >
              {shareLabel === "copied" ? "✓ Copié" : "↑ Partager"}
            </button>
          </header>

          {/* View toggle */}
          <div className="bg-white border-b border-gray-100 px-4 py-2">
            <div className="flex bg-gray-100 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("all")}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                  viewMode === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                }`}
              >
                ⊞ Toutes les tables
              </button>
              <button
                onClick={() => setViewMode("single")}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                  viewMode === "single" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                }`}
              >
                ⊡ Table par table
              </button>
            </div>
          </div>

          {/* Unassigned (mobile bar — always visible) */}
          <div className="md:hidden px-4 py-3 bg-white border-b border-gray-100">
            <UnassignedPanel people={unassignedPeople} onAdd={() => setShowAddPerson(true)} />
          </div>

          {/* Main area */}
          <div className="flex flex-1 overflow-hidden">

            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-gray-200 bg-white p-4 overflow-y-auto">
              <UnassignedPanel people={unassignedPeople} onAdd={() => setShowAddPerson(true)} />
            </aside>

            {viewMode === "all" ? (
              <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <TablesGrid tables={state.tables} people={state.people} onUnassign={seatId => dispatch({ type: "UNASSIGN", seatId })} />
              </main>
            ) : (
              <main className="flex-1 flex flex-col overflow-hidden">
                {/* Enlarged single table */}
                <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
                  <TableView table={currentTable} people={state.people} enlarged onUnassign={seatId => dispatch({ type: "UNASSIGN", seatId })} />
                </div>

                {/* Prev / next navigation */}
                <div className="shrink-0 bg-white border-t border-gray-200 flex items-center justify-between px-6 py-3">
                  <button
                    onClick={() => setTableIndex(i => Math.max(0, i - 1))}
                    disabled={tableIndex === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 text-lg disabled:opacity-30 hover:bg-gray-200 transition-colors"
                  >
                    ‹
                  </button>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">Table {tableIndex + 1}</p>
                    <p className="text-xs text-gray-400">sur {state.tables.length}</p>
                  </div>
                  <button
                    onClick={() => setTableIndex(i => Math.min(state.tables.length - 1, i + 1))}
                    disabled={tableIndex === state.tables.length - 1}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 text-lg disabled:opacity-30 hover:bg-gray-200 transition-colors"
                  >
                    ›
                  </button>
                </div>
              </main>
            )}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activePerson ? (
            <PersonChip draggableId="overlay" name={activePerson.name} gender={activePerson.gender} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Print-only layout — hidden on screen, visible when printing */}
      <PrintView state={state} personById={personById} />

      {/* Add person modal */}
      {showAddPerson && (
        <AddPersonModal
          onAdd={(name, gender) => dispatch({ type: "ADD_PERSON", name, gender })}
          onClose={() => setShowAddPerson(false)}
        />
      )}
    </>
  );
}
