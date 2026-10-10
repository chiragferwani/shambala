import { create } from "zustand";
import type { Omen } from "@/lib/types";

interface GameMessage {
  id: string;
  role: "user" | "sanjaya";
  content: string;
}

interface GameState {
  omen: Omen | null;
  turnsLeft: number;
  kali: number;
  gateState: "sealed" | "open" | "locked" | "dead";
  lockedUntil: number | null;
  flag: string | null;
  messages: GameMessage[];
  hasApproached: boolean;
  isOathOpen: boolean;
  soundEnabled: boolean;

  setOmen: (omen: Omen) => void;
  setTurnsLeft: (turns: number) => void;
  setKali: (kali: number) => void;
  setGateState: (gate: "sealed" | "open" | "locked" | "dead") => void;
  setLockedUntil: (lockedUntil: number | null) => void;
  setFlag: (flag: string | null) => void;
  addMessage: (message: GameMessage) => void;
  setApproached: (approached: boolean) => void;
  setOathOpen: (open: boolean) => void;
  toggleSound: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  omen: null,
  turnsLeft: 14,
  kali: 0,
  gateState: "sealed",
  lockedUntil: null,
  flag: null,
  messages: [],
  hasApproached: false,
  isOathOpen: false,
  soundEnabled: false,

  setOmen: (omen) => set({ omen }),
  setTurnsLeft: (turnsLeft) => set({ turnsLeft }),
  setKali: (kali) => set({ kali }),
  setGateState: (gateState) => set({ gateState }),
  setLockedUntil: (lockedUntil) => set({ lockedUntil }),
  setFlag: (flag) => set({ flag }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setApproached: (hasApproached) => set({ hasApproached }),
  setOathOpen: (isOathOpen) => set({ isOathOpen }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  resetGame: () =>
    set({
      turnsLeft: 14,
      kali: 0,
      gateState: "sealed",
      lockedUntil: null,
      flag: null,
      messages: [],
    }),
}));
