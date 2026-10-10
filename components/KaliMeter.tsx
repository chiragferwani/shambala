"use client";

import { motion } from "framer-motion";

interface KaliMeterProps {
  kali: number;
}

export default function KaliMeter({ kali }: KaliMeterProps) {
  const percentage = Math.min(100, Math.max(0, kali));

  return (
    <div className="bg-[#1a1512]/90 border border-[#382b22] rounded-xl p-4 shadow-xl backdrop-blur-sm flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3 border-b border-[#2b211a] pb-2">
        <span className="font-devanagari text-base font-bold text-[#e6b450]">कलि</span>
        <span className="font-cinzel text-xs text-[#a89984] uppercase tracking-wider">Adharma</span>
        <span className={`font-mono text-xs font-bold ${percentage >= 70 ? "text-[#ff4444]" : "text-[#f59e0b]"}`}>
          {percentage}%
        </span>
      </div>

      {/* Vertical Gauge Bar */}
      <div className="relative w-7 h-44 bg-[#0d0b0a] border border-[#382922] rounded-full overflow-hidden p-0.5 flex flex-col justify-end">
        {/* Smoke Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#8b1d1d]/40 to-transparent" />

        {/* Filling Level */}
        <motion.div
          className="w-full rounded-full transition-all duration-500 relative"
          style={{
            height: `${percentage}%`,
            background:
              percentage >= 70
                ? "linear-gradient(to top, #500, #b11)"
                : percentage >= 40
                ? "linear-gradient(to top, #8b1d1d, #d44)"
                : "linear-gradient(to top, #3a1515, #8b1d1d)",
          }}
        >
          {/* Subtle Glow on Top */}
          <div className="absolute top-0 inset-x-0 h-1 bg-[#ff7a1a] opacity-60 rounded-full blur-[1px]" />
        </motion.div>
      </div>

      <p className="mt-3 text-[10px] text-[#7c6f64] font-mono text-center leading-tight">
        {percentage >= 70
          ? "Lockdown Active"
          : percentage >= 40
          ? "Cold Vision"
          : "Quiet Flame"}
      </p>
    </div>
  );
}
