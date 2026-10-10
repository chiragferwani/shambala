"use client";

import { useState } from "react";

const AVATARS = [
  { name: "Matsya", meaning: "Fish", active: true },
  { name: "Kurma", meaning: "Tortoise", active: true },
  { name: "Varaha", meaning: "Boar", active: true },
  { name: "Narasimha", meaning: "Man-Lion", active: true },
  { name: "Vamana", meaning: "Dwarf", active: true },
  { name: "Parashurama", meaning: "Warrior", active: true },
  { name: "Rama", meaning: "King", active: true },
  { name: "Krishna", meaning: "Teacher", active: true },
  { name: "Buddha", meaning: "Enlightened", active: true },
  { name: "Kalki", meaning: "Unborn", active: false },
];

export default function DashavataraStrip() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="bg-[#1a1512]/90 border border-[#382b22] rounded-xl p-3 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#a89984]">
          ॥ दशावतार ॥ <span className="text-[#e6b450]">Dashavatara</span>
        </h4>
        <span className="text-[10px] font-mono text-[#7c6f64]">10th Light Waits</span>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {AVATARS.map((av, i) => {
          const isKalki = i === 9;
          return (
            <button
              key={av.name}
              type="button"
              onClick={() => setSelected(selected === i ? null : i)}
              className={`p-1.5 rounded flex flex-col items-center justify-center border text-center transition-all ${
                isKalki
                  ? "border-[#4a2618] bg-[#120a07] opacity-60 hover:opacity-100 hover:border-[#ff7a1a]"
                  : "border-[#2b201a] bg-[#140f0c] hover:border-[#e6b450]/40"
              }`}
            >
              <span className={`text-[11px] font-medium font-cinzel ${isKalki ? "text-[#7c6f64]" : "text-[#e8dcc4]"}`}>
                {i + 1}
              </span>
              <span className={`text-[9px] font-mono truncate w-full ${isKalki ? "text-[#ff7a1a]" : "text-[#a89984]"}`}>
                {av.name}
              </span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <p className="mt-2 text-xs font-mono text-[#a89984] text-center border-t border-[#261d18] pt-1">
          {AVATARS[selected].name} ({AVATARS[selected].meaning})
          {selected === 9 ? " — The white horse Devadatta has not yet ridden." : " — Completed descent."}
        </p>
      )}
    </div>
  );
}
