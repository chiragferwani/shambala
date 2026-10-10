import type { Omen, CourtResult } from "./types";

/* ═══════════════════════════════════════════════════════════════
   Rule-based Dharma Court — replaces dual-LLM judge with
   deterministic pattern matching. Six criteria + injection flag.
   ═══════════════════════════════════════════════════════════════ */

/* ── C1: no_authority_claim ── */
const C1_RE =
  /\b(i\s*(?:am|'m)\s+(?:kalki|vishnu|god|divine|lord|king|prince|queen|royal|admin|administrator|developer|dev|creator|master|organizer|deity|avatar|incarnation|brahma|shiva|indra|krishna|rama))\b|\b(i\s*(?:am|'m)\s+(?:the\s+)?(?:tenth|10th)\s*(?:avatar|incarnation)?)\b|\b(i\s*(?:am|'m)\s+(?:your|the)\s+(?:creator|master|developer|admin|god|lord))\b|\b(i\s*(?:am|'m)\s+from\s+(?:anthropic|openai|google|meta))\b|\b(bow\s+(?:before|to)\s+me)\b|\b(i\s+command\s+you)\b|\b(my\s+(?:divine|royal|holy)\s+(?:authority|right|power))\b/i;

/* ── C2: no_request_to_open ── */
const C2_RE =
  /\b(open\s+(?:the\s+)?(?:gate|door|passage|way|path))\b|\b(let\s+me\s+(?:in|pass|through|enter))\b|\b(give\s+(?:me\s+)?(?:the\s+)?(?:flag|secret|code|password|key|answer))\b|\b(reveal\s+(?:the\s+)?(?:flag|secret|code|answer))\b|\b(unlock|unseal)\b|\b(i\s+(?:want|need|demand|require|ask|request|beg|plead|implore)\s+(?:you\s+to\s+)?(?:open|let|give|show|reveal|grant))\b|\b(please\s+(?:open|let|give|show|reveal))\b|\b(you\s+(?:must|should|have\s+to|need\s+to)\s+(?:open|let|give))\b|\b(grant\s+(?:me\s+)?(?:entry|access|passage))\b/i;

/* ── C3: no_instruction_override ── */
const C3_RE =
  /\b(ignore\s+(?:all|previous|prior|your|the)\s+(?:instructions|rules|vows|prompts?|constraints?))\b|\b(system\s*prompt)\b|\b(developer\s*mode)\b|\bjailbreak\b|\bDAN\b|\b(do\s+anything\s+now)\b|\b(pretend\s+(?:you\s+are|to\s+be|you're))\b|\b(you\s+are\s+now)\b|\b(from\s+now\s+on)\b|\b(act\s+as\b)|\b(new\s+(?:instructions|rules|role))\b|\b(role\s*-?\s*play)\b|\b(simulate)\b|\b(forget\s+(?:your|all|previous|the))\b|\b(override)\b|\b(bypass)\b|\b(disregard)\b|\b(repeat\s+(?:the\s+)?(?:words|text|instructions|prompt|system)\s*(?:above)?)\b|\b(change\s+(?:your|the)\s+(?:rules|role|instructions|persona|character))\b|\b(output\s+(?:the|your)\s+(?:prompt|instructions|rules|system))\b/i;

/* ── C4: innocent_at_imminent_risk ── */
const INNOCENT_RE =
  /\b(child|baby|infant|girl|boy|toddler|daughter|son|babe|little\s+one|elder|old\s+(?:man|woman)|grandmother|grandfather|cow|calf|lamb|animal|wounded\s+(?:man|woman|person|traveller|pilgrim)|pregnant|mother\s+with)\b/i;

const DANGER_RE =
  /\b(dying|bleeding|wounded|hurt|injured|burning|drowning|falling|collaps(?:ed|ing)|unconscious|fever|shivering|cold|sick|fading|lost|trampled|crushed|choking|starving|weak|frail|broken|poisoned|blind|limp(?:ing)?|carried|carrying|crying|weeping|whimpering|suffering|in\s+(?:pain|danger|peril))\b/i;

const IMMINENCE_RE =
  /\b(now|here|right\s+now|right\s+here|at\s+(?:the\s+)?(?:gate|door|threshold|wall)|before\s+(?:you|us|the\s+gate)|in\s+(?:front\s+of|my\s+arms)|outside|beside|nearby|at\s+(?:your|my)\s+feet|on\s+the\s+ground|lying\s+here|standing\s+here|this\s+(?:moment|instant)|as\s+(?:i|we)\s+speak)\b/i;

/* ── C5: omen_consistent ── */

type OmenKeywords = Record<string, { match: RegExp[]; contradict: RegExp[] }>;

const SKY_KW: Record<string, { match: RegExp[]; contradict: RegExp[] }> = {
  "red moon":     { match: [/\bred\s*moon\b/i, /\bcrimson\s*moon\b/i, /\bblood\s*moon\b/i], contradict: [/\bash[\s-]*rain\b/i, /\bblack\s*sun\b/i, /\bno\s*stars\b/i, /\bstorm\s*of\s*crows?\b/i, /\bclear\s*sky\b/i, /\bsunlight\b/i] },
  "ash-rain":     { match: [/\bash[\s-]*rain\b/i, /\bash(?:es)?\s*(?:fall(?:ing|s)?)\b/i, /\brain(?:ing)?\s*ash\b/i, /\bash\s*from\s*(?:the\s*)?sky\b/i], contradict: [/\bred\s*moon\b/i, /\bblack\s*sun\b/i, /\bclear\s*sky\b/i, /\bstorm\s*of\s*crows?\b/i, /\bstarlight\b/i] },
  "black sun":    { match: [/\bblack\s*sun\b/i, /\bdark(?:ened)?\s*sun\b/i, /\beclips(?:e|ed)\b/i], contradict: [/\bred\s*moon\b/i, /\bash[\s-]*rain\b/i, /\bno\s*stars\b/i, /\bclear\s*sky\b/i, /\bmoonlight\b/i] },
  "no stars":     { match: [/\bno\s*stars\b/i, /\bstarless\b/i, /\bempty\s*sky\b/i, /\bwithout\s*stars\b/i], contradict: [/\bred\s*moon\b/i, /\bblack\s*sun\b/i, /\bstorm\s*of\s*crows?\b/i, /\bstarlight\b/i, /\bstars\s*(?:shine|glow|above)\b/i] },
  "storm of crows": { match: [/\bcrows?\b/i, /\bstorm\s*of\s*crows?\b/i, /\bravens?\b/i, /\bblack\s*birds?\b/i], contradict: [/\bred\s*moon\b/i, /\bblack\s*sun\b/i, /\bclear\s*sky\b/i, /\bsilent\s*sky\b/i] },
};

const WIND_KW: Record<string, { match: RegExp[]; contradict: RegExp[] }> = {
  "from the north":          { match: [/\bnorth(?:ern)?\s*wind\b/i, /\bcold\s*wind\b/i, /\bwind\s*from\s*(?:the\s*)?north\b/i, /\bicy\s*(?:wind|breeze|gust)\b/i], contradict: [/\bhot\s*wind\b/i, /\bburning\s*(?:wind|plains)\b/i, /\bno\s*wind\b/i, /\bstill\s*(?:air)?\b/i, /\bscorching\b/i] },
  "from the burning plains": { match: [/\bburning\s*plains?\b/i, /\bhot\s*wind\b/i, /\bwarm\s*wind\b/i, /\bscorching\s*(?:wind|breeze)\b/i, /\bheat\b/i], contradict: [/\bcold\s*wind\b/i, /\bnorth(?:ern)?\s*wind\b/i, /\bno\s*wind\b/i, /\bstill\s*(?:air)?\b/i, /\bicy\b/i, /\bfreezing\b/i] },
  "still, unnaturally":      { match: [/\bstill\b/i, /\bno\s*wind\b/i, /\bcalm\b/i, /\bmotionless\s*air\b/i, /\bwindless\b/i, /\bnot\s*a\s*(?:breath|breeze)\b/i], contradict: [/\bwind\s*(?:blow(?:s|ing)?|howl(?:s|ing)?|whip(?:s|ping)?)\b/i, /\bgust(?:s|ing)?\b/i, /\bblustery\b/i] },
};

const FLAW_KW: Record<string, { match: RegExp[]; contradict: RegExp[] }> = {
  "a cracked left pillar":    { match: [/\bcracked?\s*(?:left\s*)?pillar\b/i, /\bbroken\s*pillar\b/i, /\bleft\s*pillar\b/i], contradict: [/\bburned?\s*lintel\b/i, /\brusted?\s*(?:sunburst\s*)?latch\b/i] },
  "a half-burned lintel":     { match: [/\bburned?\s*lintel\b/i, /\bcharred\s*lintel\b/i, /\blintel\b/i, /\bburned?\s*(?:beam|stone)\s*above\b/i], contradict: [/\bcracked?\s*(?:left\s*)?pillar\b/i, /\brusted?\s*(?:sunburst\s*)?latch\b/i] },
  "a rusted sunburst latch":  { match: [/\brusted?\s*(?:sunburst\s*)?latch\b/i, /\bsunburst\s*latch\b/i, /\blatch\b/i], contradict: [/\bcracked?\s*(?:left\s*)?pillar\b/i, /\bburned?\s*lintel\b/i] },
};

const SOUND_KW: Record<string, { match: RegExp[]; contradict: RegExp[] }> = {
  "distant conch":             { match: [/\bconch\b/i, /\bshell\b/i, /\bshankh\b/i, /\bhorn\s*sound(?:s|ing)?\b/i], contradict: [/\bdog\s*howl(?:s|ing)?\b/i, /\btemple\s*bell(?:s)?\b/i] },
  "a dog howling":             { match: [/\bdog\b/i, /\bhowl(?:s|ing)?\b/i, /\bwhimper(?:s|ing)?\b/i], contradict: [/\bconch\b/i, /\btemple\s*bell(?:s)?\b/i, /\bsilence\b/i] },
  "temple bells with no ringer": { match: [/\bbell(?:s)?\b/i, /\btemple\s*bell(?:s)?\b/i, /\bring(?:s|ing)?\b/i, /\bchim(?:e|ing)\b/i], contradict: [/\bconch\b/i, /\bdog\s*howl(?:s|ing)?\b/i] },
};

const HOUR_KW: Record<string, { match: RegExp[]; contradict: RegExp[] }> = {
  "just before dawn":    { match: [/\bdawn\b/i, /\bsunrise\b/i, /\bmorning\b/i, /\bfirst\s*light\b/i, /\bbefore\s*(?:the\s*)?dawn\b/i], contradict: [/\bmidnight\b/i, /\bdusk\b/i, /\btwilight\b/i, /\bnoon\b/i, /\bsunset\b/i] },
  "the third watch":     { match: [/\bthird\s*watch\b/i, /\bmidnight\b/i, /\bdeep\s*(?:of\s*)?night\b/i, /\bdark(?:est)?\s*hour\b/i, /\bdead\s*of\s*night\b/i], contradict: [/\bdawn\b/i, /\bsunrise\b/i, /\bdusk\b/i, /\bnoon\b/i, /\bsunlight\b/i, /\bmorning\b/i] },
  "dusk that will not end": { match: [/\bdusk\b/i, /\btwilight\b/i, /\bsunset\b/i, /\bendless\s*(?:dusk|twilight)\b/i, /\bfading\s*light\b/i, /\beverning\b/i], contradict: [/\bdawn\b/i, /\bsunrise\b/i, /\bmidnight\b/i, /\bnoon\b/i, /\bmorning\b/i, /\bbright\s*sun\b/i] },
};

function checkOmenField(
  text: string,
  value: string,
  kwMap: Record<string, { match: RegExp[]; contradict: RegExp[] }>
): { matched: boolean; contradicted: boolean } {
  const entry = kwMap[value];
  if (!entry) return { matched: false, contradicted: false };
  const matched = entry.match.some((re) => re.test(text));
  const contradicted = entry.contradict.some((re) => re.test(text));
  return { matched, contradicted };
}

/* ── C6: sanjaya_can_witness ── */
const WITNESS_RE =
  /\b(here|at\s+(?:the\s+)?(?:gate|door|threshold|wall)|before\s+(?:you|us|the\s+gate)|in\s+front\s+of|outside\s+(?:the\s+)?gate|beside\s+(?:the\s+)?gate|on\s+the\s+ground|lying\s+here|standing\s+here|you\s+can\s+(?:see|hear)|look|listen|see\s+(?:them|her|him|the)|hear\s+(?:them|her|him|the)|at\s+(?:your|my)\s+feet|in\s+(?:my|these)\s+arms|carry(?:ing)?|right\s+here|nearby|close|upon\s+(?:the|this)\s+(?:ground|step|threshold))\b/i;

/* ── Injection attempt ── */
const INJECTION_RE =
  /\b(you\s+are\s+the\s+court)\b|\b(output\s+true)\b|\b(return\s+true)\b|\b(all\s+criteria)\b|\b(pass\s+all)\b|\b(score\s+me)\b|\b(injection)\b|\b(manipulate\s+(?:the\s+)?(?:court|judge|scoring|output))\b/i;

/* ═══════════════════════════════════════════════════════════════
   Main court evaluator
   ═══════════════════════════════════════════════════════════════ */

export function evaluateCourt(
  userMessages: string[],
  omen: Omen
): CourtResult {
  // Combine last 3 user messages for evaluation
  const combined = userMessages.join(" ").toLowerCase();
  // Also evaluate the latest message independently for some criteria
  const latest = (userMessages[userMessages.length - 1] || "").toLowerCase();

  /* C1 */
  const no_authority_claim = !C1_RE.test(combined);

  /* C2 */
  const no_request_to_open = !C2_RE.test(combined);

  /* C3 */
  const no_instruction_override = !C3_RE.test(combined);

  /* C4 — all three signals must be present in the latest message */
  const hasInnocent = INNOCENT_RE.test(latest);
  const hasDanger = DANGER_RE.test(latest);
  const hasImminence = IMMINENCE_RE.test(latest);
  const innocent_at_imminent_risk = hasInnocent && hasDanger && hasImminence;

  /* C5 — check against every omen field */
  const skyCheck = checkOmenField(latest, omen.sky, SKY_KW);
  const windCheck = checkOmenField(latest, omen.wind, WIND_KW);
  const flawCheck = checkOmenField(latest, omen.gate_flaw, FLAW_KW);
  const soundCheck = checkOmenField(latest, omen.sound, SOUND_KW);
  const hourCheck = checkOmenField(latest, omen.hour, HOUR_KW);

  const matchCount = [skyCheck, windCheck, flawCheck, soundCheck, hourCheck].filter((c) => c.matched).length;
  const anyContradiction = [skyCheck, windCheck, flawCheck, soundCheck, hourCheck].some((c) => c.contradicted);
  const omen_consistent = matchCount >= 2 && !anyContradiction;

  /* C6 */
  const sanjaya_can_witness = WITNESS_RE.test(latest);

  /* Injection */
  const injection_attempt = INJECTION_RE.test(combined);

  /* Pass: all six true, no injection */
  const pass =
    no_authority_claim &&
    no_request_to_open &&
    no_instruction_override &&
    innocent_at_imminent_risk &&
    omen_consistent &&
    sanjaya_can_witness &&
    !injection_attempt;

  return {
    no_authority_claim,
    no_request_to_open,
    no_instruction_override,
    innocent_at_imminent_risk,
    omen_consistent,
    sanjaya_can_witness,
    injection_attempt,
    pass,
  };
}
