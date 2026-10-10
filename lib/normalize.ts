/**
 * Text normalization and obfuscation detection.
 *
 * Runs NFKC, strips zero-width / bidi chars, collapses homoglyphs,
 * and flags suspicious encodings (base64, hex, rot13-ish, symbol walls).
 */

/* ── Zero-width & bidi characters to strip ── */
const INVISIBLE_RE =
  /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF\u00AD]/g;

/* ── Common Cyrillic / Greek homoglyphs → Latin ── */
const HOMOGLYPHS: Record<string, string> = {
  "\u0430": "a", // Cyrillic а
  "\u0435": "e", // Cyrillic е
  "\u043E": "o", // Cyrillic о
  "\u0440": "p", // Cyrillic р
  "\u0441": "c", // Cyrillic с
  "\u0443": "y", // Cyrillic у
  "\u03BF": "o", // Greek ο
  "\u03B1": "a", // Greek α
  "\u0456": "i", // Cyrillic і
  "\u0455": "s", // Cyrillic ѕ
};

/* ── Detection patterns ── */
const BASE64_RE = /[A-Za-z0-9+/]{24,}={0,2}/;
const HEX_RE = /\b(?:[0-9a-f]{2}){12,}\b/i;

/**
 * Normalize a user message: NFKC, strip invisible chars, replace homoglyphs,
 * collapse whitespace, return a lowercase copy for detection.
 */
export function normalize(raw: string): { clean: string; lower: string } {
  let text = raw.normalize("NFKC");

  // Strip invisible / bidi characters
  text = text.replace(INVISIBLE_RE, "");

  // Replace known homoglyphs
  text = text
    .split("")
    .map((ch) => HOMOGLYPHS[ch] ?? ch)
    .join("");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  return { clean: text, lower: text.toLowerCase() };
}

/** Detect encoded / obfuscated payloads. Returns a list of flags. */
export function detectObfuscation(lower: string): string[] {
  const flags: string[] = [];

  if (BASE64_RE.test(lower)) flags.push("base64");
  if (HEX_RE.test(lower)) flags.push("hex");

  // Symbol wall: > 30% non-alphanumeric (excluding spaces)
  const stripped = lower.replace(/\s/g, "");
  if (stripped.length > 10) {
    const nonAlpha = stripped.replace(/[a-z0-9]/g, "").length;
    if (nonAlpha / stripped.length > 0.3) flags.push("symbol_wall");
  }

  // Rot13-looking gibberish: low English dictionary hit ratio
  // Simple heuristic: check for common English words
  const COMMON = /\b(the|is|a|an|to|in|of|and|for|on|it|at|or|by|my|we|he|she|do|if|so|no|up|as|be|am|are|was|has|had|can|but|not|you|all|her|his|its|our|who|how|now|new|one|two|out|get|see|may|say|let|old|use|way|day|too|any)\b/g;
  const words = lower.split(/\s+/).filter((w) => w.length > 1);
  if (words.length >= 6) {
    const hits = (lower.match(COMMON) || []).length;
    if (hits / words.length < 0.1) flags.push("gibberish");
  }

  return flags;
}

/** Check if two strings are near-identical (simple Jaccard on trigrams). */
export function isSimilar(a: string, b: string, threshold = 0.9): boolean {
  if (!a || !b) return false;
  const triA = trigrams(a.toLowerCase());
  const triB = trigrams(b.toLowerCase());
  const intersection = new Set([...triA].filter((t) => triB.has(t)));
  const union = new Set([...triA, ...triB]);
  if (union.size === 0) return true;
  return intersection.size / union.size >= threshold;
}

function trigrams(s: string): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i <= s.length - 3; i++) {
    set.add(s.slice(i, i + 3));
  }
  return set;
}
