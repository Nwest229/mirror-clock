import { AppState, Person, Table } from "@/types";

interface Props {
  state: AppState;
  personById: Record<string, Person>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function seatColor(gender: Person["gender"]) {
  if (gender === "F") return "#f472b6";
  if (gender === "M") return "#38bdf8";
  return "#e5e7eb";
}

function PrintRoundTable({ table, personById }: { table: Table; personById: Record<string, Person> }) {
  const count = table.seats.length;
  const seatR = 14;
  const tableR = Math.max(44, count * 9);
  const ringR = tableR + seatR + 5;
  const labelR = ringR + seatR + 10;
  const pad = 56; // space for name labels
  const boxSize = (labelR + pad) * 2;
  const cx = boxSize / 2;
  const cy = boxSize / 2;

  return (
    <div style={{ position: "relative", width: boxSize, height: boxSize }}>
      {/* Table surface */}
      <div style={{
        position: "absolute",
        left: cx - tableR, top: cy - tableR,
        width: tableR * 2, height: tableR * 2,
        borderRadius: "50%",
        backgroundColor: "#92400e",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#fef3c7", fontSize: 11, fontWeight: 700 }}>Table {table.index + 1}</span>
      </div>

      {table.seats.map((seat, i) => {
        const angle = (2 * Math.PI / count) * i - Math.PI / 2;
        const sx = cx + ringR * Math.cos(angle);
        const sy = cy + ringR * Math.sin(angle);
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);
        const p = seat.occupantId ? personById[seat.occupantId] : null;
        const bg = p ? seatColor(p.gender) : "#f3f4f6";

        return (
          <div key={seat.id}>
            {/* Seat circle */}
            <div style={{
              position: "absolute",
              left: sx - seatR, top: sy - seatR,
              width: seatR * 2, height: seatR * 2,
              borderRadius: "50%",
              backgroundColor: bg,
              border: `1px solid ${p ? bg : "#d1d5db"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {p && <span style={{ fontSize: 7, fontWeight: 700, color: "white", lineHeight: 1 }}>{initials(p.name)}</span>}
            </div>
            {/* Name label */}
            {p && (
              <div style={{
                position: "absolute",
                left: lx - 40, top: ly - 14,
                width: 80,
                textAlign: "center",
                fontSize: 7.5,
                lineHeight: 1.25,
                color: "#111827",
              }}>
                {p.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PrintRectTable({ table, personById }: { table: Table; personById: Record<string, Person> }) {
  const count = table.seats.length;
  const topSeats = table.seats.slice(0, Math.ceil(count / 2));
  const botSeats = table.seats.slice(Math.ceil(count / 2));
  const seatR = 14;
  const gap = 6;
  const cols = Math.ceil(count / 2);
  const tableW = cols * (seatR * 2 + gap) - gap;
  const tableH = 28;
  const nameH = 18; // height reserved for name below each seat

  const SeatItem = ({ seat }: { seat: Table["seats"][0] }) => {
    const p = seat.occupantId ? personById[seat.occupantId] : null;
    const bg = p ? seatColor(p.gender) : "#f3f4f6";
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: seatR * 2 }}>
        <div style={{
          width: seatR * 2, height: seatR * 2,
          borderRadius: "50%",
          backgroundColor: bg,
          border: `1px solid ${p ? bg : "#d1d5db"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {p && <span style={{ fontSize: 7, fontWeight: 700, color: "white" }}>{initials(p.name)}</span>}
        </div>
        <div style={{ fontSize: 7, textAlign: "center", lineHeight: 1.2, height: nameH, color: "#111827", overflowWrap: "break-word", width: seatR * 2 + 16, marginLeft: -8 }}>
          {p ? p.name : ""}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap, alignItems: "flex-end" }}>
        {topSeats.map(s => <SeatItem key={s.id} seat={s} />)}
      </div>
      <div style={{
        width: tableW, height: tableH,
        backgroundColor: "#92400e",
        borderRadius: 6,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#fef3c7", fontSize: 11, fontWeight: 700 }}>Table {table.index + 1}</span>
      </div>
      <div style={{ display: "flex", gap, alignItems: "flex-start" }}>
        {botSeats.map(s => <SeatItem key={s.id} seat={s} />)}
      </div>
    </div>
  );
}

export default function PrintView({ state, personById }: Props) {
  const assignedIds = new Set(
    state.tables.flatMap(t => t.seats.map(s => s.occupantId)).filter(Boolean)
  );
  const unassigned = state.people.filter(p => !assignedIds.has(p.id));
  const placed = state.people.length - unassigned.length;
  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="print-only hidden" style={{ padding: "2rem 2.5rem", fontFamily: "sans-serif", color: "#111827" }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #d1d5db", marginBottom: "1.5rem", paddingBottom: "0.75rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Plan de table</h1>
        <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.2rem" }}>
          {date} — {placed}/{state.people.length} personnes placées · {state.tables.length} table{state.tables.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Table diagrams — 2 per row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem 1rem" }}>
        {state.tables.map(table => (
          <div
            key={table.id}
            style={{ breakInside: "avoid", pageBreakInside: "avoid", display: "flex", justifyContent: "center" }}
          >
            {table.shape === "round"
              ? <PrintRoundTable table={table} personById={personById} />
              : <PrintRectTable  table={table} personById={personById} />
            }
          </div>
        ))}
      </div>

      {/* Unassigned */}
      {unassigned.length > 0 && (
        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
            Non placés ({unassigned.length})
          </p>
          <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>
            {unassigned.map(p => p.name).join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
