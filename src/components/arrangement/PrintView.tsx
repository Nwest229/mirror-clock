import { AppState, Person } from "@/types";

interface Props {
  state: AppState;
  personById: Record<string, Person>;
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
    <div className="print-only hidden p-10 font-sans text-gray-900">
      {/* Header */}
      <div style={{ borderBottom: "2px solid #d1d5db", marginBottom: "2rem", paddingBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>Plan de table</h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
          {date} — {placed}/{state.people.length} personnes placées · {state.tables.length} table{state.tables.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Tables grid — 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
        {state.tables.map((table, i) => {
          const occupied = table.seats.filter(s => s.occupantId);
          return (
            <div
              key={table.id}
              style={{
                breakInside: "avoid",
                pageBreakInside: "avoid",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "0.875rem 1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.625rem" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Table {i + 1}</span>
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{occupied.length}/{table.seats.length}</span>
              </div>

              {occupied.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "#9ca3af", fontStyle: "italic", margin: 0 }}>Aucun invité</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {occupied.map(seat => {
                    const p = personById[seat.occupantId!];
                    const color = p?.gender === "F" ? "#ec4899" : p?.gender === "M" ? "#0284c7" : "#d1d5db";
                    const symbol = p?.gender === "F" ? "♀" : p?.gender === "M" ? "♂" : "○";
                    return (
                      <li key={seat.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", paddingBottom: "0.2rem" }}>
                        <span style={{ color, fontSize: "0.75rem", minWidth: "1em" }}>{symbol}</span>
                        <span>{p?.name ?? "—"}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Unassigned */}
      {unassigned.length > 0 && (
        <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            Non placés ({unassigned.length})
          </p>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>
            {unassigned.map(p => p.name).join(" · ")}
          </p>
        </div>
      )}
    </div>
  );
}
