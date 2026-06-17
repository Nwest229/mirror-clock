"use client";

import { useEffect, useReducer } from "react";
import { Action, AppState, Person, Seat, Table } from "@/types";

const STORAGE_KEY = "seating-app-v2";

const defaultState: AppState = {
  screen: "setup",
  config: null,
  people: [],
  tables: [],
};

function loadInitialState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as AppState;
  } catch {}
  return defaultState;
}

function buildTables(tableCount: number, seatsPerTable: number, shape: import("@/types").TableShape): Table[] {
  return Array.from({ length: tableCount }, (_, ti) => {
    const tableId = `table-${ti}`;
    const seats: Seat[] = Array.from({ length: seatsPerTable }, (_, si) => ({
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

    case "RESET_TO_SETUP":
      return defaultState;

    default:
      return state;
  }
}

export function useSeatingReducer() {
  const [state, rawDispatch] = useReducer(seatingReducer, undefined, loadInitialState);

  useEffect(() => {
    if (state.screen === "arrangement") {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    }
  }, [state]);

  function dispatch(action: Action) {
    if (action.type === "RESET_TO_SETUP") {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
    rawDispatch(action);
  }

  return [state, dispatch] as const;
}
