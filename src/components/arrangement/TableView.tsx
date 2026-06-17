import { Person, Table } from "@/types";
import RoundTable from "./RoundTable";
import RectangularTable from "./RectangularTable";

interface TableViewProps {
  table: Table;
  people: Person[];
  enlarged?: boolean;
  onUnassign?: (seatId: string) => void;
}

export default function TableView({ table, people, enlarged = false, onUnassign }: TableViewProps) {
  return table.shape === "round" ? (
    <RoundTable table={table} people={people} enlarged={enlarged} onUnassign={onUnassign} />
  ) : (
    <RectangularTable table={table} people={people} enlarged={enlarged} onUnassign={onUnassign} />
  );
}
