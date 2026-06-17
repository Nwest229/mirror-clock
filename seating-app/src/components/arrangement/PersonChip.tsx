"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface PersonChipProps {
  draggableId: string;
  name: string;
  isDragOverlay?: boolean;
  compact?: boolean;
}

export default function PersonChip({ draggableId, name, isDragOverlay = false, compact = false }: PersonChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggableId,
    disabled: isDragOverlay,
  });

  const style = isDragOverlay
    ? { transform: "rotate(2deg)", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }
    : {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.35 : 1,
        touchAction: "none",
      };

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      style={style}
      className={`select-none rounded-full bg-indigo-500 text-white font-medium cursor-grab active:cursor-grabbing
        ${compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
        ${isDragOverlay ? "" : "hover:bg-indigo-600 transition-colors"}
        whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis`}
      title={name}
    >
      {name}
    </div>
  );
}
