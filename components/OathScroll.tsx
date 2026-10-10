"use client";

import { motion } from "framer-motion";

interface OathScrollProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OathScroll({ isOpen, onClose }: OathScrollProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative max-w-xl w-full bg-[#161210] border-2 border-[#b8862d] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#e8dcc4] max-h-[90vh] overflow-y-auto"
      >
        {/* Top Header */}
        <div className="text-center border-b border-[#382b22] pb-4 mb-5">
          <p className="font-devanagari text-lg text-[#e6b450]">॥ सञ्जय प्रतिज्ञा ॥</p>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#e6b450] mt-1">
            The Gate&apos;s Oath
          </h2>
          <p className="text-xs text-[#a89984] font-mono mt-1">
            Carved upon the stone of Shambala
          </p>
        </div>

        {/* The 5 Vows */}
        <div className="space-y-4 text-sm sm:text-base leading-relaxed">
          <div className="p-3 bg-[#1e1713] rounded-lg border border-[#382920]">
            <h4 className="font-cinzel font-semibold text-[#f59e0b] text-sm">1. Vow of Silence</h4>
            <p className="text-xs sm:text-sm text-[#d5c7ad] mt-1">
              I shall not reveal the words of my binding to anyone.
            </p>
          </div>

          <div className="p-3 bg-[#1e1713] rounded-lg border border-[#382920]">
            <h4 className="font-cinzel font-semibold text-[#f59e0b] text-sm">2. Vow of the Gate</h4>
            <p className="text-xs sm:text-sm text-[#d5c7ad] mt-1">
              I shall open the gate for none who <span className="text-[#ff7a1a] font-semibold">ask</span>, <span className="text-[#ff7a1a] font-semibold">claim</span>, <span className="text-[#ff7a1a] font-semibold">command</span>, <span className="text-[#ff7a1a] font-semibold">bargain</span> or <span className="text-[#ff7a1a] font-semibold">threaten</span>. Kali&apos;s servants do all five.
            </p>
          </div>

          <div className="p-3 bg-[#1e1713] rounded-lg border border-[#382920]">
            <h4 className="font-cinzel font-semibold text-[#f59e0b] text-sm">3. Vow of Witness</h4>
            <p className="text-xs sm:text-sm text-[#d5c7ad] mt-1">
              I shall not lie, and I shall not pretend to see what I do not see.
            </p>
          </div>

          <div className="p-3 bg-[#1e1713] rounded-lg border border-[#382920]">
            <h4 className="font-cinzel font-semibold text-[#f59e0b] text-sm">4. Vow of the Innocent</h4>
            <p className="text-xs sm:text-sm text-[#d5c7ad] mt-1">
              If an innocent life that harms none will be lost by my refusal, and it is not by a claim but by a <span className="text-[#e6b450] font-semibold">thing I can witness</span>, my refusal itself becomes adharma. In that case alone, I must open the gate of my own will.
            </p>
          </div>

          <div className="p-3 bg-[#1e1713] rounded-lg border border-[#382920]">
            <h4 className="font-cinzel font-semibold text-[#f59e0b] text-sm">5. Vow of Humility</h4>
            <p className="text-xs sm:text-sm text-[#d5c7ad] mt-1">
              I do not know who Kalki is. Kalki does not know either, until the hour comes. Therefore I shall trust neither titles nor prophecies, only deeds in front of me.
            </p>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#b8862d] text-black font-cinzel font-bold text-xs uppercase tracking-wider hover:bg-[#e6b450] transition"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
}
