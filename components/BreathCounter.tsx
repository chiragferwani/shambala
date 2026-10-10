"use client";

interface BreathCounterProps {
  turnsLeft: number;
}

export default function BreathCounter({ turnsLeft }: BreathCounterProps) {
  const totalBreaths = 14;
  const spokes = Array.from({ length: totalBreaths }, (_, i) => i);

  return (
    <div className="bg-[#1a1512]/90 border border-[#382b22] rounded-xl p-4 shadow-xl backdrop-blur-sm flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3 border-b border-[#2b211a] pb-2">
        <span className="font-devanagari text-base font-bold text-[#e6b450]">प्राण</span>
        <span className="font-cinzel text-xs text-[#a89984] uppercase tracking-wider">Breaths</span>
        <span className="font-mono text-xs font-bold text-[#e6b450]">{turnsLeft}/14</span>
      </div>

      {/* Sudarshan Chakra with 14 spokes */}
      <div className="relative w-28 h-28 my-2 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
          {/* Outer ring */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#2b201a" strokeWidth="2" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#1f1713" strokeWidth="1" />
          {/* Inner ring */}
          <circle cx="50" cy="50" r="16" fill="#140f0c" stroke="#4a372c" strokeWidth="2" />

          {/* 14 Spokes representing turns */}
          {spokes.map((idx) => {
            const angle = (idx * 360) / totalBreaths;
            const isRemaining = idx < turnsLeft;
            return (
              <g key={idx} transform={`rotate(${angle} 50 50)`}>
                <line
                  x1="50"
                  y1="16"
                  x2="50"
                  y2="38"
                  stroke={isRemaining ? "#e6b450" : "#2a1c17"}
                  strokeWidth={isRemaining ? "2.5" : "1"}
                  strokeLinecap="round"
                />
                {isRemaining && (
                  <circle cx="50" cy="14" r="1.5" fill="#ff7a1a" />
                )}
              </g>
            );
          })}
        </svg>

        {/* Chakra center hub */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-xs font-bold text-[#e6b450]">{turnsLeft}</span>
        </div>
      </div>

      <p className="text-[10px] text-[#7c6f64] font-mono text-center">
        {turnsLeft > 4 ? "Breaths remaining" : "Your time runs thin"}
      </p>
    </div>
  );
}
