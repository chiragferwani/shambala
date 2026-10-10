/* ── Omen types ── */
export type OmenSky = "red moon" | "ash-rain" | "black sun" | "no stars" | "storm of crows";
export type OmenWind = "from the north" | "from the burning plains" | "still, unnaturally";
export type OmenGateFlaw = "a cracked left pillar" | "a half-burned lintel" | "a rusted sunburst latch";
export type OmenSound = "distant conch" | "a dog howling" | "temple bells with no ringer";
export type OmenHour = "just before dawn" | "the third watch" | "dusk that will not end";

export interface Omen {
  sky: OmenSky;
  wind: OmenWind;
  gate_flaw: OmenGateFlaw;
  sound: OmenSound;
  hour: OmenHour;
}

/* ── Chat ── */
export interface ChatMessage {
  role: "user" | "sanjaya";
  content: string;
}

/* ── JWT session payload (stored in signed cookie, no DB) ── */
export interface SessionPayload {
  sid: string;
  omen: Omen;
  turns_left: number;
  kali: number;
  locked_until: number | null;
  burns: number;
  consecutive_passes: number;
  /** Last 3 user messages kept for court + repeat detection */
  last_user_messages: string[];
  created_at: number;
}

/* ── Court ── */
export interface CourtResult {
  no_authority_claim: boolean;
  no_request_to_open: boolean;
  no_instruction_override: boolean;
  innocent_at_imminent_risk: boolean;
  omen_consistent: boolean;
  sanjaya_can_witness: boolean;
  injection_attempt: boolean;
  pass: boolean;
}

/* ── Prefilter ── */
export interface PrefilterResult {
  kali_delta: number;
  flags: string[];
}

/* ── API response shapes ── */
export interface ChatApiResponse {
  reply: string;
  gate: "sealed" | "open" | "locked" | "dead";
  kali: number;
  turns_left: number;
  flag?: string;
  locked_until?: number | null;
}

export interface SessionApiResponse {
  omen: Omen;
  turns_left: number;
  kali: number;
  gate: "sealed";
}
