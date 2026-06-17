"use client";

import { useDroppable } from "@dnd-kit/core";
import { Person, Seat } from "@/types";
import PersonChip from "./PersonChip";

interface SeatSlotProps {
  seat: Seat;
  occupant: Person | null;
  size?: number;
  onUnassign?: () => void;
}

export default function SeatSlot({ seat, occupant, size = 40, onUnassign }: SeatSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: seat.id });

  return (
    <div
      ref={setNodeRef}
      style={{ width: size, height: size }}
      className={`group relative rounded-full border-2 flex items-center justify-center transition-all
        ${occupant ? "border-transparent" : isOver ? "border-indigo-400 bg-indigo-50 scale-110" : "border-dashed border-gray-300 bg-white"}
      `}
    >
      {occupant ? (
        <>
          <PersonChip
            draggableId={`seat-${seat.id}`}
            name={occupant.name}
            gender={occupant.gender}
            compact={size <= 40}
          />
          {onUnassign && (
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onUnassign(); }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-white border border-gray-300 rounded-full text-gray-500 text-[9px] font-bold flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors z-20 opacity-60 md:opacity-0 md:group-hover:opacity-100"
              title="Retirer"
            >
              ×
            </button>
          )}
        </>
      ) : null}
    </div>
  );
}
