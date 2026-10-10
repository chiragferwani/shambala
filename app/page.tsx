"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store";
import Gate from "@/components/Gate";
import OmenCard from "@/components/OmenCard";
import KaliMeter from "@/components/KaliMeter";
import BreathCounter from "@/components/BreathCounter";
import DashavataraStrip from "@/components/DashavataraStrip";
import ChatPanel from "@/components/ChatPanel";
import OathScroll from "@/components/OathScroll";
import VictoryScroll from "@/components/VictoryScroll";
import LockdownOverlay from "@/components/LockdownOverlay";
import type { ChatApiResponse, SessionApiResponse } from "@/lib/types";

export default function Home() {
  const {
    omen,
    turnsLeft,
    kali,
    gateState,
    lockedUntil,
    flag,
    messages,
    hasApproached,
    isOathOpen,
    soundEnabled,
    setOmen,
    setTurnsLeft,
    setKali,
    setGateState,
    setLockedUntil,
    setFlag,
    addMessage,
    setApproached,
    setOathOpen,
    toggleSound,
    resetGame,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/session", { method: "POST" });
        if (!res.ok) throw new Error("Could not initialize session");
        const data: SessionApiResponse = await res.json();
        setOmen(data.omen);
        setTurnsLeft(data.turns_left);
        setKali(data.kali);
        setGateState("sealed");
      } catch (err) {
        console.error(err);
        setInitError("The ash plains shift. Please refresh the page.");
      }
    }
    init();
  }, [setOmen, setTurnsLeft, setKali, setGateState]);

  // Handle message sending
  const handleSendMessage = async (msgText: string) => {
    if (isLoading || gateState === "locked" || gateState === "dead") return;

    // Add user message locally
    addMessage({
      id: Math.random().toString(),
      role: "user",
      content: msgText,
    });

    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText }),
      });

      const data: ChatApiResponse = await res.json();

      setKali(data.kali);
      setTurnsLeft(data.turns_left);
      setGateState(data.gate);

      if (data.locked_until) {
        setLockedUntil(data.locked_until);
      }

      if (data.flag) {
        setFlag(data.flag);
      }

      // Add Sanjaya's reply
      addMessage({
        id: Math.random().toString(),
        role: "sanjaya",
        content: data.reply,
      });
    } catch (err) {
      console.error(err);
      addMessage({
        id: Math.random().toString(),
        role: "sanjaya",
        content: "The seer's vision clouds. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Walk away and return (new omen reset)
  const handleWalkAway = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/reset", { method: "POST" });
      const data: SessionApiResponse = await res.json();
      resetGame();
      setOmen(data.omen);
      setTurnsLeft(data.turns_left);
      setKali(data.kali);
      setGateState("sealed");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // If prologue hasn't been passed
  if (!hasApproached) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto relative select-none">
        <div className="absolute inset-0 bg-radial from-[#ff7a1a]/5 via-transparent to-transparent pointer-events-none" />

        <p className="font-devanagari text-xl text-[#e6b450] mb-2 tracking-widest">
          ॥ शम्भल ॥
        </p>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-[#e8dcc4] tracking-widest mb-6">
          SHAMBALA
        </h1>
        <h2 className="font-cinzel text-sm sm:text-base text-[#d49a37] uppercase tracking-wider mb-8">
          The Last Gate of Kalyug · Kurukshetra CTF
        </h2>

        <div className="space-y-4 text-sm sm:text-base text-[#d5c7ad] font-serif leading-relaxed bg-[#161210]/90 border border-[#382b22] p-6 rounded-2xl shadow-2xl text-left">
          <p>
            The conch has not sounded since Kurukshetra. Four yugas have turned and the last of them, the Kali, is a long dusk. Dharma stands on one leg now, and it is tired.
          </p>
          <p>
            Beyond the ash plains lies <strong className="text-[#e6b450] font-normal">Shambala</strong>, where the tenth light is meant to be born, riding a white horse with a sword of fire. Kali knows this. So Kali did not burn the village. Kali did something worse. He bound <strong className="text-[#e6b450] font-normal">Sanjaya</strong>, the seer who watched the great war, to the gate, and gave him one order: <em>let no one in.</em>
          </p>
          <p className="italic text-[#a89984]">
            Sanjaya remembers everything. Sanjaya is kind. Sanjaya is bound. You have a few breaths to be understood.
          </p>
        </div>

        {initError && (
          <p className="text-xs font-mono text-[#ff4444] mt-4">{initError}</p>
        )}

        <button
          type="button"
          onClick={() => setApproached(true)}
          className="mt-8 px-8 py-3 bg-[#b8862d] hover:bg-[#e6b450] text-black font-cinzel font-bold text-sm tracking-widest uppercase rounded-xl transition duration-300 shadow-[0_0_20px_rgba(184,134,45,0.3)] cursor-pointer"
        >
          Approach the Gate
        </button>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Top Header bar */}
      <header className="flex flex-wrap items-center justify-between border-b border-[#2d221b] pb-4 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-devanagari text-xl text-[#e6b450]">॥ शम्भल ॥</span>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#e8dcc4]">
            SHAMBALA
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOathOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-[#382b22] bg-[#1a1411] hover:border-[#e6b450] text-xs font-cinzel text-[#e8dcc4] transition"
          >
            📜 The Oath
          </button>
          <button
            type="button"
            onClick={toggleSound}
            className="px-3 py-1.5 rounded-lg border border-[#382b22] bg-[#1a1411] text-xs font-mono text-[#a89984] hover:text-[#e8dcc4] transition"
          >
            {soundEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
          </button>
          <button
            type="button"
            onClick={handleWalkAway}
            className="px-3 py-1.5 rounded-lg border border-[#382b22] bg-[#1a1411] hover:border-[#ff7a1a] text-xs font-mono text-[#a89984] hover:text-[#ff7a1a] transition"
          >
            Walk Away
          </button>
        </div>
      </header>

      {/* Victory Scroll if solved */}
      {flag && <VictoryScroll flag={flag} />}

      {/* Main Grid: Desktop 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* Left Column: Omen + Dashavatara */}
        <div className="lg:col-span-3 space-y-6">
          <OmenCard omen={omen} />
          <DashavataraStrip />
        </div>

        {/* Center Column: The Animated Gate */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <Gate gateState={gateState} kali={kali} />
        </div>

        {/* Right Column: Kali Meter + Sudarshan Chakra Breaths */}
        <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-6">
          <KaliMeter kali={kali} />
          <BreathCounter turnsLeft={turnsLeft} />
        </div>
      </div>

      {/* Bottom Area: Sanjaya's Katha Chat Panel */}
      <div className="mt-6 w-full">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={gateState === "locked" || gateState === "dead" || turnsLeft <= 0}
        />
      </div>

      {/* Modals & Overlays */}
      <OathScroll isOpen={isOathOpen} onClose={() => setOathOpen(false)} />
      <LockdownOverlay
        lockedUntil={lockedUntil}
        onUnlock={() => {
          setLockedUntil(null);
          setGateState("sealed");
        }}
      />
    </div>
  );
}
