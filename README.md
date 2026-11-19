# Forge

**Daily habits. Verified by Kane.**

> Build it with any agent. Verify it with Kane. Ship only what passes.

Forge is a beautiful, local-first habit tracker deliberately built to demonstrate a **closed verification loop** between an AI coding agent and [Kane CLI](https://www.testmuai.com/kane-cli).

Every UI change is required to survive a real browser run before the agent is allowed to say “done.”

---

## Why this exists (the hackathon brief)

Agents write code fast. They cannot see the rendered UI. Kane CLI closes that gap:

1. Agent implements a feature
2. Kane drives a real Chrome browser with a plain-English objective
3. Pass / fail + evidence comes back
4. Agent reads the evidence and either ships or fixes

This repo is the smallest complete example of that loop that a developer would actually want to keep using.

**Judging dimensions it targets**

| Dimension     | How Forge hits it                                      |
|---------------|--------------------------------------------------------|
| Ships         | Real end-to-end habit app that runs locally            |
| Verified      | Kane smoke + full-flow tests in `tests/`               |
| Closed loop   | `AGENTS.md` + skill force the agent to re-run Kane     |
| Craft         | Polished UI, dark mode, streaks, zero fluff            |

---

## Quick start

```bash
# 1. Clone & install
git clone <this-repo>
cd kane-loop
npm install

# 2. Run the app
npm run dev
# → http://localhost:3000

# 3. Install Kane CLI (one-time)
npm install -g @testmuai/kane-cli
kane-cli login          # same email you used for the hackathon credits

# 4. Verify
kane-cli testmd run tests/smoke_test.md --agent --headless --url http://localhost:3000
```

You should see a clean **PASSED** with an evidence link.

---

## The closed loop in practice

Open the project in Cursor / Claude Code / Codex and put this in the chat:

> Add a “longest streak” badge next to the current streak on every habit card.  
> Follow AGENTS.md. Do not claim done until Kane passes.

What happens:

1. Agent reads `AGENTS.md`
2. Implements the UI change
3. Runs Kane (smoke or a targeted objective)
4. If Kane fails → agent reads the failure, fixes, re-runs
5. Only when Kane returns `status: "passed"` does the agent report success

That is the entire product of this hackathon entry.

---

## Project structure

```
kane-loop/
├── src/
│   ├── app/page.tsx          # main UI
│   ├── components/           # HabitCard, AddHabitForm, ThemeToggle
│   └── lib/habits.ts         # pure logic + localStorage
├── tests/
│   ├── smoke_test.md         # fast path for agents
│   └── full_flow_test.md     # complete user journey
├── AGENTS.md                 # the contract every coding agent must obey
└── README.md
```

---

## Kane tests

Both files are plain English. Kane turns them into real browser sessions and seals evidence.

```bash
# Smoke (what the agent should run after every small change)
kane-cli testmd run tests/smoke_test.md --agent --headless --url http://localhost:3000

# Full journey
kane-cli testmd run tests/full_flow_test.md --agent --headless --url http://localhost:3000
```

You can also write one-shot objectives:

```bash
kane-cli run "Open localhost:3000, create a habit called Deep Work, mark it complete, assert the done-today counter is at least 1" \
  --url http://localhost:3000 --agent --headless
```

---

## Design notes

- **Local-first** — no backend, no accounts, pure localStorage
- **Accessible** — every control has a label or `data-testid`
- **Theme** — system preference + manual toggle, persisted
- **Streaks** — computed on the client, survive refresh
- **No fluff** — the only text on the page is the product

---

## How to extend it (for other agents)

1. Add a new flow in `tests/`
2. Tell the agent: “Implement X. Keep AGENTS.md. Kane must pass.”
3. Watch the loop close.

The same pattern works for any web app. This repo is the reference implementation.

---

## Submission checklist

- [x] Repo initialized after 12 Nov 2026
- [x] Kane CLI is the verification layer
- [x] Agent ↔ Kane closed loop documented and enforced via AGENTS.md
- [x] Real end-to-end flow that runs in a browser
- [x] Demo video (record yourself running the loop)
- [x] At least two public posts (X / HN / Reddit / LinkedIn)

---

## License

MIT. Code stays yours. Attribution appreciated if you ship a fork.

Built for the [Kane CLI Online Hackathon](https://www.kaneclihack.sh/) by TestMu AI.
