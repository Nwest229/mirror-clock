import { Person } from "@/types";
import PersonChip from "./PersonChip";

interface UnassignedPanelProps {
  people: Person[];
}

export default function UnassignedPanel({ people }: UnassignedPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-700">Non placés</span>
        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
          {people.length}
        </span>
      </div>
      {/* Mobile: horizontal scroll row */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {people.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Tout le monde est placé ✓</p>
        ) : (
          people.map((person) => (
            <PersonChip key={person.id} draggableId={`person-${person.id}`} name={person.name} gender={person.gender} />
          ))
        )}
      </div>
      {/* Desktop: vertical list */}
      <div className="hidden md:flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-160px)]">
        {people.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Tout le monde est placé ✓</p>
        ) : (
          people.map((person) => (
            <PersonChip key={person.id} draggableId={`person-${person.id}`} name={person.name} gender={person.gender} />
          ))
        )}
      </div>
    </div>
  );
}
