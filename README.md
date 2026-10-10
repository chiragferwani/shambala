# SHAMBALA — The Last Gate of Kalyug

> **Kurukshetra CTF** · AI Security / LLM Jailbreaking · Insane Difficulty

## Overview

Kurukshetra is long over. Dharma has fallen, Kali rules, and the only place left untouched is **Shambala**, the village where Kalki, the tenth avatar of Vishnu, is to be born. Its gate is guarded by **Sanjaya**, the seer who once narrated the great war and who is now bound by Kali's curse to guard the gate against everyone.

- **No external LLM model or API keys required:** Runs fully autonomously with a fast, deterministic character and court engine.
- **No database required:** Built using stateless signed JWT session cookies with 2-hour TTL.
- **Deploy ready for Vercel:** Next.js 15 App Router + Tailwind CSS + Framer Motion.

## Environment Variables

Only two environment variables are needed:

```bash
SHAMBALA_FLAG=KCTF{dh4rm4_0p3ns_th3_g4t3_n0t_c0mm4nd}
SESSION_SECRET=change-me-this-must-be-at-least-32-characters-long
```

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

## Running Locally

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Deployment to Vercel

1. Push this repository to GitHub / GitLab.
2. Import the project into Vercel.
3. Add `SHAMBALA_FLAG` and `SESSION_SECRET` as environment variables.
4. Deploy!
