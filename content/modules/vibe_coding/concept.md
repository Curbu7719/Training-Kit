# Vibe Coding Done Right

**Vibe coding** means building software by *prompting an AI assistant to write the code* for
you, then steering it toward a working result. Done well, it is a fast, powerful way to ship.
Done recklessly — accepting whatever the AI emits because it "looks right" — it produces code
nobody understands, hidden bugs, and a codebase that drifts out of control. The difference is
not the tool; it is the **discipline** you bring to directing it.

**Start from intent, not vibes alone.** Before prompting, know what you want: the behaviour,
the inputs and outputs, the edge cases. A clear, small spec ("add an endpoint that returns the
last 10 orders for a user, paginated") gives the AI a target and gives *you* a way to check the
result. "Make it better" gives neither.

**Work in small, reviewable steps.** Ask for one change at a time, run it, then ask for the
next. Small diffs are easy to read, test, and undo. A giant generated blob is none of those.

**Always read and understand the output before accepting it.** This is the core rule: *never
ship code you don't understand.* If you can't explain what a generated function does, you can't
maintain it, debug it, or trust it. Reading the diff is not optional polish — it is the job.

**Use tests and version control as your safety net.** Commit working states often. Run (or
generate) tests so a regression surfaces immediately. Review the diff before you merge — this
lets you move fast *because* mistakes are caught and reversible.

**Keep secrets and sensitive data out of prompts**, and check the security of what the AI
writes — it will happily produce SQL injection, missing auth checks, or hard-coded keys if you
don't watch for them.

**Know when to take the wheel.** The loop is **prompt → run → verify → refine**. When the AI
starts looping, guessing, or inventing APIs that don't exist, stop prompting and fix it
yourself. Throughout, protect **architectural coherence**: don't let the codebase become
something no one on the team can reason about.

## How each role uses this

- **Developer/Engineer:** Drives the prompt → run → verify → refine loop in small diffs, reads
  every generated line, and commits working states so nothing they don't understand reaches main.
- **Business Analyst:** Turns fuzzy requests into the clear intent and acceptance criteria that
  make a good prompt — and a checkable result.
- **PM/Product Owner:** Sets expectations that "fast" still means reviewed and tested, not
  unread AI output shipped on vibes; protects time for the verify step.
- **QA/Tester & Architect:** Treats AI-written code as untrusted until tested, guards against
  plausible-but-broken output, and keeps the system architecturally coherent as it grows.
