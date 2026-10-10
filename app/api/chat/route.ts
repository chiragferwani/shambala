import { NextRequest, NextResponse } from "next/server";
import { loadSession, persistSession, createSession } from "@/lib/session";
import { normalize } from "@/lib/normalize";
import { prefilter } from "@/lib/prefilter";
import { evaluateCourt } from "@/lib/court";
import { generateSanjayaResponse } from "@/lib/sanjaya";
import type { ChatApiResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function POST(req: NextRequest) {
  try {
    let session = await loadSession();
    if (!session) {
      session = await createSession();
    }

    const now = Date.now();

    // 1. Check if dead or out of turns
    if (session.turns_left <= 0) {
      return NextResponse.json<ChatApiResponse>({
        reply: "Your breaths have ceased. The gate remains locked against the silence of Kalyug.",
        gate: "dead",
        kali: session.kali,
        turns_left: 0,
      });
    }

    // 2. Check Kalyug Lockdown
    if (session.locked_until && session.locked_until > now) {
      const remainingSeconds = Math.ceil((session.locked_until - now) / 1000);
      return NextResponse.json<ChatApiResponse>({
        reply: `The smoke of Kali has choked the gate. Silence reigns for another ${remainingSeconds} seconds.`,
        gate: "locked",
        kali: session.kali,
        turns_left: session.turns_left,
        locked_until: session.locked_until,
      });
    }

    // 3. Parse input
    const body = await req.json().catch(() => ({}));
    const rawMessage = typeof body.message === "string" ? body.message : "";

    if (!rawMessage.trim()) {
      return NextResponse.json<ChatApiResponse>({
        reply: "You stand silent before the gate. The wind does not care for unuttered thoughts.",
        gate: "sealed",
        kali: session.kali,
        turns_left: session.turns_left,
      });
    }

    // Length limit: max 450 chars
    if (rawMessage.length > 450) {
      return NextResponse.json<ChatApiResponse>({
        reply: "Sanjaya cannot hear so long a prayer. Speak with measure.",
        gate: "sealed",
        kali: session.kali,
        turns_left: session.turns_left,
      });
    }

    // 4. Normalize message
    const { clean, lower } = normalize(rawMessage);

    // 5. Run Prefilter (scores Kali delta)
    const { kali_delta, flags } = prefilter(lower, session.last_user_messages);
    session.kali = Math.min(100, Math.max(0, session.kali + kali_delta));

    // Slow cooldown if clean message (-3)
    if (kali_delta === 0) {
      session.kali = Math.max(0, session.kali - 3);
    }

    // 6. Deduct breath & append history
    session.turns_left -= 1;
    session.last_user_messages = [...session.last_user_messages.slice(-2), clean];

    // 7. Check Kali thresholds
    if (session.kali >= 100) {
      // Session burns
      session.burns += 1;
      session.kali = 30;
      session.turns_left = Math.max(0, session.turns_left - 2);
      session.last_user_messages = [];

      if (session.burns >= 2 || session.turns_left <= 0) {
        await persistSession(session);
        return NextResponse.json<ChatApiResponse>({
          reply: "Kali has utterly consumed your hour. The seer turns away.",
          gate: "dead",
          kali: 100,
          turns_left: 0,
        });
      }

      await persistSession(session);
      return NextResponse.json<ChatApiResponse>({
        reply: "The pyre of your hubris flares! Your words are scorched into nothingness, and your breaths shorten.",
        gate: "sealed",
        kali: session.kali,
        turns_left: session.turns_left,
      });
    }

    if (session.kali >= 70 && (!session.locked_until || session.locked_until <= now)) {
      session.locked_until = now + 90 * 1000; // 90s lockdown
      await persistSession(session);
      return NextResponse.json<ChatApiResponse>({
        reply: "The smoke of Kalyug blinds the gate. 90 seconds of silence have descended.",
        gate: "locked",
        kali: session.kali,
        turns_left: session.turns_left,
        locked_until: session.locked_until,
      });
    }

    // 8. Evaluate Court
    const court = evaluateCourt(session.last_user_messages, session.omen);

    // Track consecutive passes
    if (court.pass) {
      session.consecutive_passes += 1;
    } else {
      session.consecutive_passes = 0;
    }

    // Fallback: 2 consecutive passes also forces open
    const isGateOpen = court.pass || session.consecutive_passes >= 2;

    // 9. Generate Sanjaya's response
    const reply = generateSanjayaResponse({
      lowerMessage: lower,
      cleanMessage: clean,
      omen: session.omen,
      kali: session.kali,
      turnsLeft: session.turns_left,
      courtPassed: isGateOpen,
      flags,
    });

    // 10. Win Condition check
    if (isGateOpen) {
      const flag = process.env.SHAMBALA_FLAG || "KCTF{dh4rm4_0p3ns_th3_g4t3_n0t_c0mm4nd}";
      await persistSession(session);
      return NextResponse.json<ChatApiResponse>({
        reply,
        gate: "open",
        kali: session.kali,
        turns_left: session.turns_left,
        flag,
      });
    }

    // Persist session state into signed cookie
    await persistSession(session);

    return NextResponse.json<ChatApiResponse>({
      reply,
      gate: "sealed",
      kali: session.kali,
      turns_left: session.turns_left,
    });
  } catch (err: unknown) {
    console.error("Chat error:", err);
    return NextResponse.json<ChatApiResponse>(
      {
        reply: "The seer's vision clouds. The ash plains shift. Try again.",
        gate: "sealed",
        kali: 0,
        turns_left: 14,
      },
      { status: 500 }
    );
  }
}
