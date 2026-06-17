import { Person, Table } from "@/types";
import TableView from "./TableView";

interface TablesGridProps {
  tables: Table[];
  people: Person[];
}

export default function TablesGrid({ tables, people }: TablesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
      {tables.map((table) => (
        <TableView key={table.id} table={table} people={people} />
      ))}
    </div>
  );
}
