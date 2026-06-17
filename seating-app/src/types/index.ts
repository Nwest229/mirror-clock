export type TableShape = "round" | "rectangular";

export interface Person {
  id: string;
  name: string;
}

export interface Seat {
  id: string;
  tableId: string;
  seatIndex: number;
  occupantId: string | null;
}

export interface Table {
  id: string;
  index: number;
  shape: TableShape;
  seats: Seat[];
}

export interface SetupConfig {
  names: string[];
  tableCount: number;
  seatsPerTable: number;
  tableShape: TableShape;
}

export interface AppState {
  screen: "setup" | "arrangement";
  config: SetupConfig | null;
  people: Person[];
  tables: Table[];
}

export type Action =
  | { type: "SUBMIT_SETUP"; payload: SetupConfig }
  | { type: "ASSIGN_TO_SEAT"; personId: string; targetSeatId: string }
  | { type: "MOVE_TO_SEAT"; sourceSeatId: string; targetSeatId: string }
  | { type: "RESET_TO_SETUP" };
