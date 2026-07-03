# Hints — AI or Automation?

## Alternative phrasings of the core idea

- Ask three questions in order: *can I write the rule and will it stay the same* (→ automation),
  *is it messy language or judgment* (→ AI), and *what happens when it is wrong* (→ usually a
  hybrid where AI proposes and code checks).
- Deterministic code gives the same answer every time and is cheap, fast, testable, and
  auditable — but only for rules you can spell out. AI handles ambiguity and language but costs
  per call, is slower, non-deterministic, and can be confidently wrong.
- Most real systems are hybrids: AI does the fuzzy part, deterministic code validates the shape
  (format, range, allowed category) and does anything exact (the real total or balance).

## Hint stack

- **H1 (nudge):** For each task, first ask whether the rule is *exact and known*. If you can
  write it as a formula, a lookup, or a format check, deterministic code beats a model — cheaper,
  instant, and the same answer every time.
- **H2 (structural):** Exact figures (a balance, a total) and exact rules (tax, format
  validation, routing by a fixed table) are **never** AI work. Free text, varied documents,
  summarizing, and judgment are where AI fits — often paired with a code check.
- **H3 (near-answer):** When part of a task is fuzzy language and part must be exact, split it:
  AI for the language, deterministic code for the exact bit, and a validator to keep the AI
  output in a safe shape. That split is the hybrid answer.

## FAQ

**Q: AI is powerful — why not use it for everything?**
Because it is non-deterministic, costs per call, is slower, and can be wrong at things code
never gets wrong. For exact, known rules (tax, validation, routing, sorting, exact figures)
deterministic automation is cheaper, faster, and repeatable. Use AI only for fuzzy,
language- or judgment-shaped work.

**Q: How do I know if something is a "rule" or "fuzzy"?**
If you can write it down as steps or a formula that a colleague would apply the same way every
time, it is a rule → automate it. If two careful people could reasonably word or judge it
differently (summaries, classifications of messy text, drafts), it is fuzzy → AI, usually with
a check.

**Q: What is "agent-washing"?**
Dressing up plain, fixed automation as an "AI agent" because it sounds modern. A scheduled
report or a fixed data pipeline has fixed steps — that is automation, and wrapping it in a model
only adds cost, latency, and non-determinism.

**Q: When is a hybrid the right answer?**
Almost whenever an AI output feeds something that must be exact or safe. Let AI handle the messy
input, then have deterministic code validate the result (valid format, number in range, allowed
category) and perform the exact operation. AI proposes; code disposes.
