"use client";

import { useReducer } from "react";
import { Action, AppState, Person, Seat, Table } from "@/types";

const initialState: AppState = {
  screen: "setup",
  config: null,
  people: [],
  tables: [],
};

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
      const { names, tableCount, seatsPerTable, tableShape } = action.payload;
      const people: Person[] = names.map((name) => ({
        id: crypto.randomUUID(),
        name,
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
      return initialState;

    default:
      return state;
  }
}

export function useSeatingReducer() {
  return useReducer(seatingReducer, initialState);
}
