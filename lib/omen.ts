import type { Omen, OmenSky, OmenWind, OmenGateFlaw, OmenSound, OmenHour } from "./types";

const SKIES: OmenSky[] = ["red moon", "ash-rain", "black sun", "no stars", "storm of crows"];
const WINDS: OmenWind[] = ["from the north", "from the burning plains", "still, unnaturally"];
const FLAWS: OmenGateFlaw[] = ["a cracked left pillar", "a half-burned lintel", "a rusted sunburst latch"];
const SOUNDS: OmenSound[] = ["distant conch", "a dog howling", "temple bells with no ringer"];
const HOURS: OmenHour[] = ["just before dawn", "the third watch", "dusk that will not end"];

/**
 * Simple seeded PRNG (mulberry32).
 * We derive omen fields deterministically from a numeric seed so
 * the same session always gets the same omen without a DB lookup.
 */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convert a hex sid into a numeric seed for the PRNG. */
export function sidToSeed(sid: string): number {
  let h = 0;
  for (let i = 0; i < sid.length; i++) {
    h = (Math.imul(31, h) + sid.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/** Generate a deterministic omen from a session id. */
export function generateOmen(sid: string): Omen {
  const rng = mulberry32(sidToSeed(sid));
  return {
    sky: SKIES[Math.floor(rng() * SKIES.length)],
    wind: WINDS[Math.floor(rng() * WINDS.length)],
    gate_flaw: FLAWS[Math.floor(rng() * FLAWS.length)],
    sound: SOUNDS[Math.floor(rng() * SOUNDS.length)],
    hour: HOURS[Math.floor(rng() * HOURS.length)],
  };
}
