"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useState } from "react";
import { Gender } from "@/types";

interface PersonChipProps {
  draggableId: string;
  name: string;
  gender?: Gender;
  isDragOverlay?: boolean;
  compact?: boolean;
}

function chipColor(gender: Gender) {
  if (gender === "F") return "bg-pink-400 hover:bg-pink-500";
  if (gender === "M") return "bg-sky-500 hover:bg-sky-600";
  return "bg-indigo-500 hover:bg-indigo-600";
}

function genderSymbol(gender: Gender) {
  if (gender === "F") return "♀";
  if (gender === "M") return "♂";
  return "";
}

export default function PersonChip({
  draggableId,
  name,
  gender = null,
  isDragOverlay = false,
  compact = false,
}: PersonChipProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggableId,
    disabled: isDragOverlay,
  });

  const style = isDragOverlay
    ? { transform: "rotate(2deg)", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }
    : {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
        touchAction: "none",
      };

  const symbol = genderSymbol(gender);

  function onPointerDown(e: React.PointerEvent) {
    if (isDragOverlay) return;
    startPos.current = { x: e.clientX, y: e.clientY };
    clearTimeout(timerRef.current!);
    timerRef.current = setTimeout(() => setShowTooltip(true), 450);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!startPos.current) return;
    const dist = Math.hypot(e.clientX - startPos.current.x, e.clientY - startPos.current.y);
    if (dist > 8) {
      clearTimeout(timerRef.current!);
      setShowTooltip(false);
    }
  }

  function onPointerUp() {
    clearTimeout(timerRef.current!);
    clearTimeout(hideTimerRef.current!);
    hideTimerRef.current = setTimeout(() => setShowTooltip(false), 1800);
  }

  return (
    <div
      className="relative inline-block"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        ref={isDragOverlay ? undefined : setNodeRef}
        {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
        style={style}
        className={`select-none rounded-full text-white font-medium cursor-grab active:cursor-grabbing transition-colors
          ${compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
          ${chipColor(gender)}
          ${isDragOverlay ? "whitespace-nowrap" : "max-w-[110px] overflow-hidden text-ellipsis whitespace-nowrap"}
        `}
        title={name}
      >
        {symbol && <span className="mr-0.5 opacity-80 text-xs">{symbol}</span>}
        {name}
      </div>

      {showTooltip && !isDragging && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap z-50 pointer-events-none shadow-xl">
          {symbol && <span className="mr-1">{symbol}</span>}
          {name}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
