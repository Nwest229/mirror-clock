import { Person, Table } from "@/types";
import SeatSlot from "./SeatSlot";

interface RectangularTableProps {
  table: Table;
  people: Person[];
}

export default function RectangularTable({ table, people }: RectangularTableProps) {
  const count = table.seats.length;
  const topSeats = table.seats.slice(0, Math.ceil(count / 2));
  const bottomSeats = table.seats.slice(Math.ceil(count / 2));
  const seatSize = 40;
  const tableWidth = Math.max(100, Math.ceil(count / 2) * (seatSize + 6));

  const personById = Object.fromEntries(people.map((p) => [p.id, p]));

  const SeatRow = ({ seats }: { seats: typeof table.seats }) => (
    <div className="flex gap-1.5 justify-center">
      {seats.map((seat) => (
        <SeatSlot
          key={seat.id}
          seat={seat}
          occupant={seat.occupantId ? (personById[seat.occupantId] ?? null) : null}
          size={seatSize}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-1">
      <SeatRow seats={topSeats} />
      <div
        className="rounded-lg bg-amber-700 flex items-center justify-center shadow-inner"
        style={{ width: tableWidth, height: 36 }}
      >
        <span className="text-amber-100 text-xs font-semibold">Table {table.index + 1}</span>
      </div>
      <SeatRow seats={bottomSeats} />
    </div>
  );
}
