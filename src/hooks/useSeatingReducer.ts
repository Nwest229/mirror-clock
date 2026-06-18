"use client";

import { useEffect, useReducer, useState } from "react";
import { Action, AppState, Person, Seat, Table } from "@/types";

const STORAGE_KEY = "seating-app-v2";

const defaultState: AppState = {
  screen: "setup",
  config: null,
  people: [],
  tables: [],
};

function buildTables(tableCount: number, seatsPerTable: number[], shape: import("@/types").TableShape): Table[] {
  return Array.from({ length: tableCount }, (_, ti) => {
    const tableId = `table-${ti}`;
    const seats: Seat[] = Array.from({ length: seatsPerTable[ti] ?? seatsPerTable[0] ?? 6 }, (_, si) => ({
      id: `seat-${tableId}-${si}`,
      tableId,
      seatIndex: si,
      occupantId: null,
    }));
    return { id: tableId, index: ti, shape, seats };
  });
}

function seatingReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE": {
      const p = action.payload;
      // Migrate legacy seatsPerTable: number → number[]
      if (p.config && !Array.isArray(p.config.seatsPerTable)) {
        const n = p.config.seatsPerTable as unknown as number;
        return {
          ...p,
          config: { ...p.config, seatsPerTable: p.tables.map(t => t.seats.length) || Array(p.config.tableCount).fill(n) },
        };
      }
      return p;
    }

    case "SUBMIT_SETUP": {
      const { people: inputPeople, tableCount, seatsPerTable, tableShape } = action.payload;
      const people: Person[] = inputPeople.map(({ name, gender }) => ({
        id: crypto.randomUUID(),
        name,
        gender,
      }));
      const tables = buildTables(tableCount, seatsPerTable, tableShape);
      return { screen: "arrangement", config: action.payload, people, tables };
    }

    case "ASSIGN_TO_SEAT": {
      const { personId, targetSeatId } = action;
      return {
        ...state,
        tables: state.tables.map((table) => ({
          ...table,
          seats: table.seats.map((seat) => {
            if (seat.id === targetSeatId && seat.occupantId === null) {
              return { ...seat, occupantId: personId };
            }
            return seat;
          }),
        })),
      };
    }

    case "MOVE_TO_SEAT": {
      const { sourceSeatId, targetSeatId } = action;
      if (sourceSeatId === targetSeatId) return state;

      let mover: string | null = null;
      let displaced: string | null = null;

      for (const table of state.tables) {
        for (const seat of table.seats) {
          if (seat.id === sourceSeatId) mover = seat.occupantId;
          if (seat.id === targetSeatId) displaced = seat.occupantId;
        }
      }

      return {
        ...state,
        tables: state.tables.map((table) => ({
          ...table,
          seats: table.seats.map((seat) => {
            if (seat.id === sourceSeatId) return { ...seat, occupantId: displaced };
            if (seat.id === targetSeatId) return { ...seat, occupantId: mover };
            return seat;
          }),
        })),
      };
    }

    case "UNASSIGN": {
      return {
        ...state,
        tables: state.tables.map((table) => ({
          ...table,
          seats: table.seats.map((seat) =>
            seat.id === action.seatId ? { ...seat, occupantId: null } : seat
          ),
        })),
      };
    }

    case "ADD_PERSON": {
      const person: Person = {
        id: crypto.randomUUID(),
        name: action.name,
        gender: action.gender,
      };
      return { ...state, people: [...state.people, person] };
    }

    case "RESET_TO_SETUP":
      return defaultState;

    default:
      return state;
  }
}

export function useSeatingReducer() {
  const [state, rawDispatch] = useReducer(seatingReducer, defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Priority: URL hash (shared link) > localStorage > default
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const loaded = JSON.parse(decodeURIComponent(atob(hash))) as AppState;
        window.history.replaceState(null, "", window.location.pathname);
        rawDispatch({ type: "HYDRATE", payload: loaded });
        setReady(true);
        return;
      } catch {}
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) rawDispatch({ type: "HYDRATE", payload: JSON.parse(saved) });
    } catch {}
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (state.screen === "arrangement") {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    }
  }, [state, ready]);

  function dispatch(action: Action) {
    if (action.type === "RESET_TO_SETUP") {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
    rawDispatch(action);
  }

  return [state, dispatch, ready] as const;
}
