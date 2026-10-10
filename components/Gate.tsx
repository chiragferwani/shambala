"use client";

import { motion } from "framer-motion";

interface GateProps {
  gateState: "sealed" | "open" | "locked" | "dead";
  kali: number;
}

export default function Gate({ gateState, kali }: GateProps) {
  const isHighKali = kali >= 40;
  const isLocked = gateState === "locked";
  const isOpen = gateState === "open";

  return (
    <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center p-4">
      {/* Background Glow */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-700 blur-2xl ${
          isOpen
            ? "bg-[#e6b450]/30"
            : isHighKali
            ? "bg-[#8b1d1d]/30"
            : "bg-[#ff7a1a]/10"
        }`}
      />

      {/* The Gate SVG */}
      <svg
        viewBox="0 0 400 320"
        className="relative w-full h-full drop-shadow-2xl overflow-visible"
      >
        <defs>
          <radialGradient id="sealGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isOpen ? "#e6b450" : isHighKali ? "#ff4444" : "#ff7a1a"} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Arch Frame */}
        <path
          d="M 50 300 L 50 140 C 50 60 350 60 350 140 L 350 300 Z"
          fill="none"
          stroke="#2a201c"
          strokeWidth="14"
          filter="url(#shadow)"
        />
        <path
          d="M 65 300 L 65 140 C 65 75 335 75 335 140 L 335 300"
          fill="none"
          stroke="#42342c"
          strokeWidth="2"
        />

        {/* Left Pillar Details */}
        <line x1="50" y1="160" x2="65" y2="160" stroke="#ff7a1a" strokeWidth="2" opacity="0.4" />
        <line x1="50" y1="220" x2="65" y2="220" stroke="#ff7a1a" strokeWidth="2" opacity="0.4" />

        {/* Right Pillar Details */}
        <line x1="335" y1="160" x2="350" y2="160" stroke="#ff7a1a" strokeWidth="2" opacity="0.4" />
        <line x1="335" y1="220" x2="350" y2="220" stroke="#ff7a1a" strokeWidth="2" opacity="0.4" />

        {/* Left Gate Door */}
        <motion.path
          d="M 70 295 L 70 140 C 70 90 195 90 195 130 L 195 295 Z"
          fill="#161210"
          stroke="#382922"
          strokeWidth="3"
          animate={isOpen ? { x: -80, opacity: 0.3 } : isLocked ? { x: [-2, 2, -1, 1, 0] } : { x: 0 }}
          transition={{ duration: isOpen ? 1.8 : 0.4 }}
        />

        {/* Right Gate Door */}
        <motion.path
          d="M 205 295 L 205 130 C 205 90 330 90 330 140 L 330 295 Z"
          fill="#161210"
          stroke="#382922"
          strokeWidth="3"
          animate={isOpen ? { x: 80, opacity: 0.3 } : isLocked ? { x: [2, -2, 1, -1, 0] } : { x: 0 }}
          transition={{ duration: isOpen ? 1.8 : 0.4 }}
        />

        {/* Central Sunburst Seal */}
        <motion.g
          animate={
            isOpen
              ? { scale: [1, 1.4, 0], opacity: [1, 0.8, 0] }
              : isHighKali
              ? { rotate: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 2 } }
              : { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 4 } }
          }
          className="origin-[200px_200px]"
        >
          {/* Aura */}
          <circle cx="200" cy="200" r="45" fill="url(#sealGlow)" />
          {/* Outer Sunburst Ring */}
          <circle
            cx="200"
            cy="200"
            r="32"
            fill="#1f1814"
            stroke={isOpen ? "#e6b450" : isHighKali ? "#8b1d1d" : "#e6b450"}
            strokeWidth="3"
          />
          {/* Radial Spokes */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="200"
              y1="172"
              x2="200"
              y2="164"
              stroke={isOpen ? "#e6b450" : "#d49a37"}
              strokeWidth="2"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}
          {/* Devanagari Inscription at center */}
          <text
            x="200"
            y="207"
            textAnchor="middle"
            fill={isOpen ? "#e6b450" : isHighKali ? "#ff4444" : "#e6b450"}
            fontSize="18"
            fontFamily="Tiro Devanagari Sanskrit"
            fontWeight="bold"
          >
            धर्म
          </text>
        </motion.g>

        {/* Smoke tendrils if high Kali */}
        {isHighKali && (
          <motion.path
            d="M 60 290 Q 130 240 200 280 T 340 270"
            fill="none"
            stroke="rgba(139, 29, 29, 0.6)"
            strokeWidth="8"
            strokeLinecap="round"
            animate={{ opacity: [0.2, 0.7, 0.2], d: ["M 60 290 Q 130 240 200 280 T 340 270", "M 60 285 Q 130 260 200 270 T 340 285"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
        )}
      </svg>
    </div>
  );
}
