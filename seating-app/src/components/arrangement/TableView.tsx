import { Person, Table } from "@/types";
import RoundTable from "./RoundTable";
import RectangularTable from "./RectangularTable";

interface TableViewProps {
  table: Table;
  people: Person[];
}

export default function TableView({ table, people }: TableViewProps) {
  return table.shape === "round" ? (
    <RoundTable table={table} people={people} />
  ) : (
    <RectangularTable table={table} people={people} />
  );
}
