import { NextRequest, NextResponse } from "next/server";
import { loadSession, createSession } from "@/lib/session";
import type { SessionApiResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  try {
    const session = await createSession();
    const res: SessionApiResponse = {
      omen: session.omen,
      turns_left: session.turns_left,
      kali: session.kali,
      gate: "sealed",
    };
    return NextResponse.json(res);
  } catch (err: unknown) {
    console.error("Reset error:", err);
    return NextResponse.json(
      { error: "The seer cannot be reached. Try again." },
      { status: 500 }
    );
  }
}
