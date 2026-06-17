"use client";

import { useDroppable } from "@dnd-kit/core";
import { Person, Seat } from "@/types";
import PersonChip from "./PersonChip";

interface SeatSlotProps {
  seat: Seat;
  occupant: Person | null;
  size?: number;
}

export default function SeatSlot({ seat, occupant, size = 40 }: SeatSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: seat.id });

  return (
    <div
      ref={setNodeRef}
      style={{ width: size, height: size }}
      className={`rounded-full border-2 flex items-center justify-center transition-all
        ${occupant ? "border-transparent" : isOver ? "border-indigo-400 bg-indigo-50 scale-110" : "border-dashed border-gray-300 bg-white"}
      `}
    >
      {occupant ? (
        <PersonChip
          draggableId={`seat-${seat.id}`}
          name={occupant.name}
          gender={occupant.gender}
          compact={size <= 40}
        />
      ) : null}
    </div>
  );
}
