# AGENTS.md — Forge (KaneLoop)

You are an AI coding agent working on **Forge**, a habit tracker that is *required* to stay verified by Kane CLI.

## Non-negotiable rules

1. **Never claim a feature is done until Kane says it is.**
   After any change that touches UI, routes, components, or localStorage behavior you MUST:
   - Ensure the app is running (`npm run dev` on port 3000).
   - Run Kane CLI against the relevant flow(s).
   - Only then report success.

2. **How to run Kane**
   ```bash
   # Smoke (fast)
   kane-cli testmd run tests/smoke_test.md --agent --headless --url http://localhost:3000

   # Or one-shot objective
   kane-cli run "Open http://localhost:3000, add a habit named 'Test habit', mark it complete, and assert the streak or done count updates" --agent --headless --url http://localhost:3000
   ```

3. **Closed loop on failure**
   - Read the NDJSON / evidence from Kane.
   - Fix the exact failure (selector/text/behavior).
   - Re-run Kane.
   - Repeat until pass (max 3 attempts before escalating to the human).

4. **New features require a test**
   - When you add a user-visible flow, also add or extend a `tests/*.md` file so the next agent (or CI) can re-verify it.

5. **Do not invent selectors.** Kane uses vision + accessibility. Prefer clear labels, `data-testid`, and visible text.

## Project layout

- `src/app/page.tsx` — main UI
- `src/components/` — HabitCard, AddHabitForm, ThemeToggle
- `src/lib/habits.ts` — pure logic + localStorage
- `tests/` — Kane plain-English test files

## Commands

```bash
npm run dev          # start on :3000
npm run build
npm run verify       # runs smoke via Kane (requires kane-cli + login)
```

## Design principles

- Local-first (localStorage only for this demo)
- Beautiful, minimal, dark-mode first
- Every interactive element has clear text or aria-label
- Streaks and “done today” must stay correct after refresh
