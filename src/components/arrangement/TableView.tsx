import { Person, Table } from "@/types";
import RoundTable from "./RoundTable";
import RectangularTable from "./RectangularTable";

interface TableViewProps {
  table: Table;
  people: Person[];
  enlarged?: boolean;
}

export default function TableView({ table, people, enlarged = false }: TableViewProps) {
  return table.shape === "round" ? (
    <RoundTable table={table} people={people} enlarged={enlarged} />
  ) : (
    <RectangularTable table={table} people={people} enlarged={enlarged} />
  );
}
