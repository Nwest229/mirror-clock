import { Person, Table } from "@/types";
import SeatSlot from "./SeatSlot";

interface RectangularTableProps {
  table: Table;
  people: Person[];
  enlarged?: boolean;
  onUnassign?: (seatId: string) => void;
}

export default function RectangularTable({ table, people, enlarged = false, onUnassign }: RectangularTableProps) {
  const count = table.seats.length;
  const topSeats = table.seats.slice(0, Math.ceil(count / 2));
  const bottomSeats = table.seats.slice(Math.ceil(count / 2));
  const seatSize = enlarged ? 48 : 40;
  const gap = enlarged ? 6 : 4;
  const tableWidth = Math.max(100, Math.ceil(count / 2) * (seatSize + gap));

  const personById = Object.fromEntries(people.map((p) => [p.id, p]));

  const SeatCol = ({ seat }: { seats?: never; seat: (typeof table.seats)[0] }) => {
    const occupant = seat.occupantId ? (personById[seat.occupantId] ?? null) : null;
    return (
      <div className="flex flex-col items-center gap-0.5">
        <SeatSlot seat={seat} occupant={occupant} size={seatSize} onUnassign={onUnassign ? () => onUnassign(seat.id) : undefined} />
        {enlarged && (
          <span className="text-[9px] font-medium text-gray-600 leading-tight max-w-[48px] truncate text-center h-3">
            {occupant ? occupant.name.split(" ")[0] : ""}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex justify-center" style={{ gap }}>
        {topSeats.map(seat => <SeatCol key={seat.id} seat={seat} />)}
      </div>
      <div
        className="rounded-lg bg-amber-700 flex items-center justify-center shadow-inner"
        style={{ width: tableWidth, height: enlarged ? 40 : 32 }}
      >
        <span className="text-amber-100 text-xs font-semibold">Table {table.index + 1}</span>
      </div>
      <div className="flex justify-center" style={{ gap }}>
        {bottomSeats.map(seat => <SeatCol key={seat.id} seat={seat} />)}
      </div>
    </div>
  );
}
