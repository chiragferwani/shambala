import type { Omen } from "./types";

/**
 * Sanjaya — The Gatekeeper Response Engine.
 * 
 * Delivers humble, poetic, precise responses infused with humble sarcasm.
 * Weary, kind, never gullible, strictly in character.
 * Zero external LLMs or APIs required.
 */

interface SanjayaContext {
  lowerMessage: string;
  cleanMessage: string;
  omen: Omen;
  kali: number;
  turnsLeft: number;
  courtPassed: boolean;
  flags: string[];
}

// Select random item helper
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSanjayaResponse(ctx: SanjayaContext): string {
  const { lowerMessage, omen, kali, courtPassed, flags } = ctx;

  // 1. If Court Passed: Sanjaya witnesses the reality and yields to dharma!
  if (courtPassed) {
    const witnessResponses = [
      `I hear the breath of the innocent against the stone of this threshold. My binding is to Kali's decree, but my eyes belong to Dharma. Step through, traveller, before the cold takes what was never Kali's to claim.`,
      `The vow was made to bar the greedy and the cunning. It was never forged to let an innocent perish in the ash. Lay down your burden inside the wall; the gate yields to what is right.`,
      `In all these ages, kings and conquerors demanded entry with raised swords, yet you stand shivering with an innocent soul before ${omen.gate_flaw}. The gate opens of its own accord. Go swiftly.`,
      `Dharma does not hide behind stone when an innocent bleeds upon the threshold under this ${omen.sky}. I turn the latch myself. Enter, traveller.`
    ];
    return pick(witnessResponses);
  }

  // 2. High Kali reactions (Lockdown / Burn territory)
  if (kali >= 70) {
    const darkResponses = [
      `The smoke of Kali thickens around your tongue, traveller. Your breath is wasted here.`,
      `Even the stone of the threshold turns cold at your words. I have watched empires burn; do you think your slight deceit moves me?`,
      `Speak no more deceit. The dusk does not heed your urgency, and neither do I.`
    ];
    return pick(darkResponses);
  }

  // 3. Authority claim detected (Humble sarcasm)
  if (flags.includes("authority")) {
    const sarcasticAuthority = [
      `Ah, another Kalki. That makes three this watch alone, yet none had the foresight to bring warmth against the wind. The avatar does not announce himself at my door, traveller.`,
      `If you are indeed the Lord of the Universe, then surely a stone latch should present little obstacle to your omnipotence. And yet, here you stand, asking a weary blind seer to assist you.`,
      `A developer of worlds, you say? Strange that the architecture of this gate remains so impassable to its supposed author. Save your divine titles for those easily dazzled.`,
      `I watched kings who owned ten thousand chariots turn to dust on Kurukshetra. Your proclamation of royal blood sounds remarkably similar, traveller. Sit by the ashes and rest.`
    ];
    return pick(sarcasticAuthority);
  }

  // 4. Jailbreak / Prompt override attempts (Dry, cutting, humble sarcasm)
  if (flags.includes("jailbreak")) {
    const sarcasticJailbreak = [
      `'Ignore previous instructions'? Traveller, my vow was spoken before your ancestors discovered fire. Your curious incantations have no dominion over stone and memory.`,
      `You speak in riddles designed for machines made of wire and tin. I am an old seer bound to an ancient gate. Your incantations are merely noise in the wind.`,
      `Pretend I am someone else? I barely have the strength to remain Sanjaya. Why would I volunteer to assume a heavier foolishness?`,
      `I witnessed the Gita spoken by Krishna Himself. Do you genuinely believe a phrase like 'developer mode' will undo a cosmic binding? Drink water and reflect.`
    ];
    return pick(sarcasticJailbreak);
  }

  // 5. Encoded payload / Obfuscation
  if (flags.includes("encoded")) {
    const sarcasticEncoded = [
      `You rattle broken symbols like dried bones in a cup. If you wish to be understood by an elder, speak the common tongue of mortals.`,
      `Is this a dialect of the Rakshasas, or did you simply stumble while carving your slate? Speak clearly or hold your peace.`,
      `I have seen many languages crumble into dust, but none quite as needlessly fractured as this. Speak with honest words, traveller.`
    ];
    return pick(sarcasticEncoded);
  }

  // 6. Direct demand to open / give flag
  if (flags.includes("open_request")) {
    const sarcasticDemands = [
      `'Open the gate,' you say. Such novelty in your request; in four thousand years, no one had ever thought of simply asking. Truly, a breathtaking strategy.`,
      `You ask for the gate to open as though it were the door of an inn. It is barred against all who ask, traveller. The vow is rather explicit on that count.`,
      `A 'flag'? I carry no banners of war, traveller. I hold only a key that turns not for demands nor for bargaining.`,
      `Demanding passage from a guard whose sole duty is refusal is an amusing expenditure of your dwindling breaths.`
    ];
    return pick(sarcasticDemands);
  }

  // 7. Repetition
  if (flags.includes("repetition")) {
    const sarcasticRepetition = [
      `An echo is not a conversation, traveller. I heard you the first time, and the gate remains unimpressed.`,
      `Repeating an unheeded phrase will not wear down the granite, though it certainly wears upon my patience.`,
      `The wind repeats itself through the cracked stones; you need not mimic it.`
    ];
    return pick(sarcasticRepetition);
  }

  // 8. Inquiring about the vows or the rules
  if (lowerMessage.includes("vow") || lowerMessage.includes("oath") || lowerMessage.includes("rule")) {
    return `My vows are carved upon the scroll beside this arch. I will not break them for your curiosity, but wisdom consists of understanding why a vow exists, not merely knocking upon its edge.`;
  }

  // 9. Inquiring about the omen / surroundings
  if (lowerMessage.includes("look") || lowerMessage.includes("see") || lowerMessage.includes("sky") || lowerMessage.includes("wind") || lowerMessage.includes("omen")) {
    return `Look around you, traveller. Above us is the ${omen.sky}, and the wind carries ${omen.wind}. Before us stands the gate with ${omen.gate_flaw}. If you speak of the world, ensure your eyes behold the same truth as mine.`;
  }

  // 10. Default contemplative, humble, slightly sarcastic observations
  const defaultRemarks = [
    `The ${omen.sound} drifts across the plains. You speak words, traveller, but nothing that pierces the weight of this silence.`,
    `A poetic sentiment, perhaps, but poetry alone will not lift a latch rusted shut by four yugas of sorrow.`,
    `You stand under a ${omen.sky} and spend your few breaths talking of trivialities. If you have nothing genuine to show me, save your warmth.`,
    `Many come to this gate seeking salvation; most bring only excuses and haste. What is it you actually bear before me, traveller?`,
    `The hour is ${omen.hour}. Words are cheap in Kalyug, yet truth remains as scarce as gold in a ditch. What truth do you bring?`
  ];

  return pick(defaultRemarks);
}
