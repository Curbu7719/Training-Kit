# Designing the Split: Hybrid Patterns, Cost, and Testing

At L1 you learned to decide per task: exact rule → automation, fuzzy language → AI, and when
it must be exact or safe → a hybrid. At L2 we go into *how* to build the hybrid well, what it
costs at scale, and how to test each half — because the split is a design decision, not a
one-off choice.

**Pattern 1 — Extract-then-validate.** AI turns messy input into structured data; deterministic
code then checks that structure. A model reads varied invoices and returns an invoice number,
date, and total; code validates the number's format, that the date is real, and that the total
is a positive amount — rejecting or flagging anything that fails. The AI handles variety; the
rule guarantees the data is usable and safe to act on.

**Pattern 2 — Classify-then-route.** AI assigns a fuzzy input to one of a **fixed, known** set
of labels; deterministic rules act on the label. Support text → one of four intents (AI) → route
by a lookup table (code). Constrain the model to the allowed set and fall back to a safe default
("Other", "needs human") when confidence is low or the answer is not in the set.

**Pattern 3 — Deterministic-first, AI-fallback.** Try the cheap, exact path first; call AI only
when it fails. A known vendor template? Parse it with a rule (free, instant). Unknown layout?
*Then* fall back to the model. This keeps cost and latency low because most traffic never
touches AI, and it degrades gracefully.

**Pattern 4 — AI-proposes, human-or-rule-disposes.** For anything high-stakes, the AI output is
a *draft*, never the final action. A person approves it, or a rule gates it (amount under a
threshold auto-approves; over it requires review). This is how you get AI's speed without
betting correctness on a single non-deterministic call.

**Cost, latency, and reliability at scale.** The AI-vs-automation choice is also an operations
choice. Every AI call costs money and adds latency (often hundreds of milliseconds to seconds);
deterministic code is effectively free and instant. At 10 requests a day the difference is
noise; at 10 million it decides the budget. So push work onto the deterministic path wherever a
rule suffices, cache and batch AI calls, and reserve the model for the fraction of inputs that
genuinely need it. Reliability differs too: deterministic code fails loudly and the same way;
AI can fail *silently and differently* each time — which is why its output needs checks and
monitoring, not a single green test.

**Testing each half — differently.** Deterministic parts get **exact** tests: given input X,
assert output Y, every time. AI parts cannot be tested that way, because the same input may vary.
Instead you build an **evaluation set** (many representative inputs with acceptable answers) and
measure a *rate* — accuracy, or how often the output passes your validators — against a
threshold, re-running it when the model or prompt changes. Confusing the two — expecting an AI
step to pass a single exact test, or leaving a deterministic step only "spot-checked" — is a
common source of flaky systems.

**A quick decision frame.** For each task, score four things: **how exact** the answer must be,
**how variable** the input is, **how costly a wrong answer** is, and **how much volume** you
expect. High exactness + low variability → automation. High variability + tolerable errors → AI.
High exactness *and* high variability → hybrid (AI for variety, code for exactness). High volume
pushes you toward a deterministic-first design to control cost.

## How each role uses this

- **Enterprise Architect / Developer:** Choose the pattern (extract-then-validate,
  deterministic-first, propose-then-gate), draw the AI/deterministic boundary explicitly, and
  put validators and fallbacks around every AI output.
- **Tester / DevOps:** Test deterministic parts exactly and AI parts with an eval set and a
  threshold; monitor AI cost, latency, and pass-rate in production, not just once.
- **Project / Portfolio Manager:** Weigh volume and cost — a design that calls AI on every
  request may be fine at pilot scale and unaffordable at full rollout.
- **Governance:** Require logging of AI inputs/outputs, a human or rule gate on high-stakes
  decisions, and a clear record of which parts are deterministic (auditable) versus AI.
