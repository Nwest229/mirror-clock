export type TableShape = "round" | "rectangular";
export type Gender = "F" | "M" | null;

export interface Person {
  id: string;
  name: string;
  gender: Gender;
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
  people: { name: string; gender: Gender }[];
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
  | { type: "RESET_TO_SETUP" }
  | { type: "HYDRATE"; payload: AppState };
