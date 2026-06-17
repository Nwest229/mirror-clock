import { Person, Table } from "@/types";
import SeatSlot from "./SeatSlot";

interface RoundTableProps {
  table: Table;
  people: Person[];
  enlarged?: boolean;
}

function getSeatPositions(count: number, containerSize: number, seatSize: number) {
  const center = containerSize / 2;
  const radius = center - seatSize / 2 - 4;
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI / count) * i - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle) - seatSize / 2,
      y: center + radius * Math.sin(angle) - seatSize / 2,
      // label position: just outside the seat circle
      lx: center + (radius + seatSize / 2 + 10) * Math.cos(angle),
      ly: center + (radius + seatSize / 2 + 10) * Math.sin(angle),
    };
  });
}

export default function RoundTable({ table, people, enlarged = false }: RoundTableProps) {
  const count = table.seats.length;
  const seatSize = enlarged
    ? (count <= 6 ? 52 : count <= 10 ? 44 : 38)
    : (count <= 6 ? 44 : count <= 10 ? 38 : 32);

  // enlarged: use a padding ring around the circle for name labels
  const innerSize = enlarged
    ? Math.min(300, Math.max(200, count * 26))
    : Math.min(320, Math.max(180, count * 32));
  const labelPad = enlarged ? 28 : 0;
  const containerSize = innerSize + labelPad * 2;

  const positions = getSeatPositions(count, innerSize, seatSize).map(p => ({
    ...p,
    x: p.x + labelPad,
    y: p.y + labelPad,
    lx: p.lx + labelPad,
    ly: p.ly + labelPad,
  }));

  const personById = Object.fromEntries(people.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: containerSize, height: containerSize }}>
        {/* Table surface */}
        <div
          className="absolute rounded-full bg-amber-700 shadow-inner"
          style={{ inset: labelPad + seatSize / 2 + 2 }}
        />
        {/* Table label */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{ inset: labelPad + seatSize / 2 + 2 }}
        >
          <span className="text-amber-100 text-xs font-semibold">Table {table.index + 1}</span>
        </div>
        {/* Seats + optional name labels */}
        {table.seats.map((seat, i) => {
          const occupant = seat.occupantId ? (personById[seat.occupantId] ?? null) : null;
          return (
            <div key={seat.id}>
              <div className="absolute" style={{ left: positions[i].x, top: positions[i].y }}>
                <SeatSlot seat={seat} occupant={occupant} size={seatSize} />
              </div>
              {enlarged && occupant && (
                <div
                  className="absolute pointer-events-none text-center"
                  style={{
                    left: positions[i].lx,
                    top: positions[i].ly,
                    transform: "translate(-50%, -50%)",
                    width: 56,
                  }}
                >
                  <span className="text-[10px] font-medium text-gray-700 leading-tight block truncate">
                    {occupant.name.split(" ")[0]}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
