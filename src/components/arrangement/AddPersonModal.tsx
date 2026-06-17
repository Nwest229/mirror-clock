"use client";

import { useEffect, useRef, useState } from "react";
import { Gender } from "@/types";

interface Props {
  onAdd: (name: string, gender: Gender) => void;
  onClose: () => void;
}

const genderOptions: { value: Gender; label: string; active: string }[] = [
  { value: "F",   label: "♀ Fille",   active: "bg-pink-100 text-pink-700 ring-2 ring-pink-300" },
  { value: "M",   label: "♂ Garçon",  active: "bg-sky-100 text-sky-700 ring-2 ring-sky-300" },
  { value: null,  label: "—",          active: "bg-gray-200 text-gray-700 ring-2 ring-gray-300" },
];

export default function AddPersonModal({ onAdd, onClose }: Props) {
  const [name, setName]     = useState("");
  const [gender, setGender] = useState<Gender>(null);
  const [flash, setFlash]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, gender);
    setName("");
    setFlash(true);
    setTimeout(() => { setFlash(false); inputRef.current?.focus(); }, 1000);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Ajouter une personne</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Prénom Nom"
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
          />

          <div className="flex gap-2">
            {genderOptions.map(({ value, label, active }) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => setGender(value)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  gender === value ? active : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            {flash ? "✓ Ajouté" : "Ajouter"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
