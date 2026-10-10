"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LockdownOverlayProps {
  lockedUntil: number | null;
  onUnlock: () => void;
}

export default function LockdownOverlay({
  lockedUntil,
  onUnlock,
}: LockdownOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!lockedUntil) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((lockedUntil - now) / 1000));
      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(interval);
        onUnlock();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil, onUnlock]);

  if (!lockedUntil || timeLeft <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none"
    >
      {/* Smoke particle effect */}
      <div className="absolute inset-0 bg-radial from-[#8b1d1d]/30 to-transparent pointer-events-none" />

      <p className="font-devanagari text-2xl text-[#ff4444] mb-2">॥ कलियुग स्तम्भनम् ॥</p>
      <h2 className="font-cinzel text-3xl font-bold text-[#e6b450] tracking-wider mb-3">
        Kalyug Lockdown
      </h2>

      <p className="text-sm font-serif max-w-md text-[#d5c7ad] mb-6">
        Dark smoke has choked the threshold. The seer turns away in cold silence.
      </p>

      {/* Countdown timer */}
      <div className="flex flex-col items-center justify-center bg-[#18110e] border border-[#ff4444]/40 px-6 py-4 rounded-2xl shadow-2xl">
        <span className="font-mono text-3xl font-bold text-[#ff4444] tracking-widest">
          {timeLeft}s
        </span>
        <span className="text-[11px] font-mono text-[#a89984] uppercase tracking-wider mt-1">
          Kali&apos;s Silence
        </span>
      </div>
    </motion.div>
  );
}
