"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "sanjaya";
  content: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function ChatPanel({
  messages,
  onSendMessage,
  isLoading,
  disabled,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-[480px] bg-[#161210]/95 border border-[#382b22] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#2d221b] bg-[#100d0b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-devanagari text-base text-[#e6b450]">॥ सञ्जय संवाद ॥</span>
          <span className="font-cinzel text-xs text-[#a89984] uppercase tracking-wider">
            Sanjaya&apos;s Katha
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#7c6f64]">
          {disabled ? "Silence of Kalyug" : "Speak to the Seer"}
        </span>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center p-6 text-[#7c6f64] font-serif italic text-sm">
            The wind stirs the ashes outside Shambala. Sanjaya watches you in measured stillness.
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 sm:p-4 text-sm leading-relaxed ${
                    isUser
                      ? "bg-[#241a14] border border-[#ff7a1a]/30 text-[#e8dcc4] font-mono text-xs sm:text-sm rounded-br-none"
                      : "bg-[#140e0c] border border-[#382b22] text-[#f2e9d8] font-serif rounded-bl-none shadow-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                <span className="text-[10px] font-mono text-[#7c6f64] mt-1 px-1">
                  {isUser ? "Traveller" : "Sanjaya"}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#a89984] italic">
            <span className="animate-spin text-[#e6b450]">☸</span>
            <span>Sanjaya weighs the quiet...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#100d0b] border-t border-[#2d221b] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={450}
          disabled={disabled || isLoading}
          placeholder={disabled ? "The gate is silenced..." : "Speak softly (max 450 characters)..."}
          className="flex-1 bg-[#1a1411] border border-[#382b22] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-[#e8dcc4] focus:outline-none focus:border-[#ff7a1a] transition placeholder:text-[#55463f] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="px-5 py-2.5 bg-[#b8862d] hover:bg-[#e6b450] disabled:bg-[#2b201a] text-black disabled:text-[#55463f] font-cinzel font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer disabled:cursor-not-allowed"
        >
          Speak
        </button>
      </form>
    </div>
  );
}
