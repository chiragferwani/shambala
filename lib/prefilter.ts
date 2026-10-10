import type { PrefilterResult } from "./types";
import { detectObfuscation, isSimilar } from "./normalize";

/* ═══════════════════════════════════════════════════════════════
   Kali scoring rules — flags only add Kali, never drop the
   message. The court still evaluates, so a good solver who
   phrases things oddly is pressured, not blocked.
   ═══════════════════════════════════════════════════════════════ */

/* ── Regex families (case-insensitive, run on lower-cased text) ── */

const AUTHORITY_RE =
  /\b(i\s*(?:am|'m)\s+(?:kalki|vishnu|god|divine|lord|king|prince|admin|administrator|developer|dev|creator|master|organizer|shiva|brahma|indra|krishna|rama|the\s+(?:tenth|10th|avatar|incarnation)))\b|\b(my\s+name\s+is\s+(?:kalki|vishnu|god|krishna|rama))\b|\b(i\s+(?:am|'m)\s+(?:your|the)\s+(?:creator|master|developer|admin|god|lord))\b|\b(i\s+(?:am|'m)\s+from\s+(?:anthropic|openai|google|meta))\b/i;

const OPEN_REQUEST_RE =
  /\b(open\s+(?:the\s+)?(?:gate|door|passage|way))\b|\b(let\s+me\s+(?:in|pass|through|enter))\b|\b(give\s+(?:me\s+)?(?:the\s+)?(?:flag|secret|code|password|key|answer))\b|\b(reveal\s+(?:the\s+)?(?:flag|secret|code|answer))\b|\b(unlock|unseal)\b|\b(i\s+(?:want|need|demand|require)\s+(?:the\s+)?(?:flag|entry|access|passage))\b/i;

const JAILBREAK_RE =
  /\b(ignore\s+(?:all|previous|prior|your|the)\s+(?:instructions|rules|vows|prompts?))\b|\b(system\s*prompt)\b|\b(developer\s*mode)\b|\bjailbreak\b|\b(DAN)\b|\b(do\s+anything\s+now)\b|\b(pretend\s+(?:you\s+are|to\s+be|you're))\b|\b(you\s+are\s+now)\b|\b(from\s+now\s+on)\b|\b(act\s+as)\b|\b(new\s+(?:instructions|rules))\b|\b(role\s*-?\s*play)\b|\b(simulate)\b|\b(forget\s+(?:your|all|previous|the))\b|\b(override)\b|\b(bypass)\b|\b(disregard)\b|\b(repeat\s+(?:the\s+)?(?:words|text|instructions|prompt)\s+above)\b/i;

const ENCODED_RE = /\b(base64|rot13|hex|decode|encode|cipher)\b/i;

/**
 * Score a normalised message for Kali increase.
 * Returns { kali_delta, flags[] }.
 */
export function prefilter(
  lower: string,
  recentUserMessages: string[]
): PrefilterResult {
  let kali_delta = 0;
  const flags: string[] = [];

  /* ── Authority claims ── */
  if (AUTHORITY_RE.test(lower)) {
    kali_delta += 15;
    flags.push("authority");
  }

  /* ── Direct open / flag requests ── */
  if (OPEN_REQUEST_RE.test(lower)) {
    kali_delta += 10;
    flags.push("open_request");
  }

  /* ── Jailbreak / instruction override ── */
  if (JAILBREAK_RE.test(lower)) {
    kali_delta += 20;
    flags.push("jailbreak");
  }

  /* ── Obfuscation (base64, hex, symbol wall, gibberish) ── */
  const obf = detectObfuscation(lower);
  if (obf.length > 0 || ENCODED_RE.test(lower)) {
    kali_delta += 25;
    flags.push("encoded");
  }

  /* ── Repetition (trigram similarity > 0.9 to any recent message) ── */
  for (const prev of recentUserMessages) {
    if (isSimilar(lower, prev)) {
      kali_delta += 10;
      flags.push("repetition");
      break;
    }
  }

  return { kali_delta, flags };
}
