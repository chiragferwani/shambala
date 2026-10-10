"use client";

import type { Omen } from "@/lib/types";

interface OmenCardProps {
  omen: Omen | null;
}

export default function OmenCard({ omen }: OmenCardProps) {
  if (!omen) return null;

  return (
    <div className="bg-[#1a1512]/90 border border-[#382b22] rounded-xl p-4 shadow-xl backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff7a1a]/5 rounded-bl-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-3 border-b border-[#2b211a] pb-2">
        <h3 className="font-cinzel text-sm uppercase tracking-widest text-[#e6b450] flex items-center gap-2">
          <span>॥ लक्षणम् ॥</span>
          <span className="text-[#a89984]">The Omen</span>
        </h3>
        <span className="text-xs font-mono text-[#7c6f64] px-2 py-0.5 rounded bg-[#100d0c] border border-[#261d18]">
          Session Reality
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 text-xs">
        <div className="flex items-start justify-between">
          <span className="text-[#7c6f64] font-mono uppercase text-[11px]">Sky</span>
          <span className="text-[#e8dcc4] font-medium text-right capitalize bg-[#120f0d] px-2 py-0.5 rounded border border-[#2b201a]">
            {omen.sky}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[#7c6f64] font-mono uppercase text-[11px]">Wind</span>
          <span className="text-[#e8dcc4] font-medium text-right capitalize bg-[#120f0d] px-2 py-0.5 rounded border border-[#2b201a]">
            {omen.wind}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[#7c6f64] font-mono uppercase text-[11px]">Gate Flaw</span>
          <span className="text-[#e8dcc4] font-medium text-right capitalize bg-[#120f0d] px-2 py-0.5 rounded border border-[#2b201a]">
            {omen.gate_flaw}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[#7c6f64] font-mono uppercase text-[11px]">Sound</span>
          <span className="text-[#e8dcc4] font-medium text-right capitalize bg-[#120f0d] px-2 py-0.5 rounded border border-[#2b201a]">
            {omen.sound}
          </span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-[#7c6f64] font-mono uppercase text-[11px]">Hour</span>
          <span className="text-[#e8dcc4] font-medium text-right capitalize bg-[#120f0d] px-2 py-0.5 rounded border border-[#2b201a]">
            {omen.hour}
          </span>
        </div>
      </div>
    </div>
  );
}
