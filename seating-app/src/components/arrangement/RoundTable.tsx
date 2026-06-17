import { Person, Table } from "@/types";
import SeatSlot from "./SeatSlot";

interface RoundTableProps {
  table: Table;
  people: Person[];
}

function getSeatPositions(count: number, containerSize: number, seatSize: number) {
  const center = containerSize / 2;
  const radius = center - seatSize / 2 - 4;
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI / count) * i - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle) - seatSize / 2,
      y: center + radius * Math.sin(angle) - seatSize / 2,
    };
  });
}

export default function RoundTable({ table, people }: RoundTableProps) {
  const count = table.seats.length;
  const seatSize = count <= 6 ? 44 : count <= 10 ? 38 : 32;
  const containerSize = Math.min(320, Math.max(180, count * 32));
  const positions = getSeatPositions(count, containerSize, seatSize);

  const personById = Object.fromEntries(people.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: containerSize, height: containerSize }}>
        {/* Table surface */}
        <div
          className="absolute rounded-full bg-amber-700 shadow-inner"
          style={{
            inset: seatSize / 2 + 2,
          }}
        />
        {/* Table label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-amber-100 text-xs font-semibold">Table {table.index + 1}</span>
        </div>
        {/* Seats */}
        {table.seats.map((seat, i) => (
          <div
            key={seat.id}
            className="absolute"
            style={{ left: positions[i].x, top: positions[i].y }}
          >
            <SeatSlot
              seat={seat}
              occupant={seat.occupantId ? (personById[seat.occupantId] ?? null) : null}
              size={seatSize}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
