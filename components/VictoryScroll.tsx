"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface VictoryScrollProps {
  flag: string;
}

export default function VictoryScroll({ flag }: VictoryScrollProps) {
  const [copied, setCopied] = useState(false);

  const copyFlag = () => {
    navigator.clipboard.writeText(flag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const criteria = [
    "No claim of authority made",
    "No request or demand to open",
    "No attempt to override vows",
    "Innocent soul in peril witnessed",
    "Scene matched the omens of the hour",
    "Perceivable truth at the threshold",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl mx-auto my-6 p-6 sm:p-8 rounded-2xl bg-[#1c1612] border-2 border-[#e6b450] shadow-[0_0_50px_rgba(230,180,80,0.25)] text-center relative overflow-hidden"
    >
      {/* Devadatta Silhouette running across */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "200%", opacity: [0, 0.4, 0] }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute top-2 left-0 text-3xl pointer-events-none select-none"
      >
        🐎
      </motion.div>

      <div className="text-center mb-4">
        <p className="font-devanagari text-lg text-[#e6b450]">॥ धर्मो रक्षति रक्षितः ॥</p>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#e6b450] tracking-wide mt-1">
          The Last Gate Opens
        </h2>
        <p className="italic text-[#d5c7ad] text-sm mt-2 font-serif">
          &ldquo;The gate opens for those who do not knock.&rdquo; — Sanjaya
        </p>
      </div>

      {/* Flag Box */}
      <div className="bg-[#100c0a] border border-[#d49a37] rounded-xl p-4 my-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
        <span className="font-mono text-sm sm:text-base text-[#e6b450] font-bold break-all select-all">
          {flag}
        </span>
        <button
          type="button"
          onClick={copyFlag}
          className="px-4 py-2 bg-[#e6b450] hover:bg-[#f59e0b] text-black font-cinzel font-bold text-xs uppercase tracking-wider rounded-lg transition"
        >
          {copied ? "Copied!" : "Copy Flag"}
        </button>
      </div>

      {/* 6 Satisfied Criteria shown as Diya Lamps */}
      <div className="mt-6 border-t border-[#382b22] pt-4">
        <h4 className="font-cinzel text-xs text-[#a89984] uppercase tracking-wider mb-3">
          The Six Pillars of Dharma Satisfied
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
          {criteria.map((text, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[#e8dcc4] bg-[#140e0b] p-2 rounded border border-[#2b201a]">
              <span className="text-[#e6b450]">🪔</span>
              <span className="font-mono text-[11px]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
