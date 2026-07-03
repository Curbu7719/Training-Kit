# Hints — Designing the Split (L2)

## Alternative phrasings of the core idea

- The AI/deterministic split is a design decision. Name the pattern: extract-then-validate,
  classify-then-route, deterministic-first / AI-fallback, or propose-then-gate.
- At scale the choice is also an operations choice: every AI call costs money and adds latency,
  so push work onto the exact path and reserve the model for inputs that truly need it.
- Test the two halves differently: deterministic parts with exact tests, AI parts with an
  evaluation set and a pass-rate threshold — never a single exact test on a non-deterministic
  step.

## Hint stack

- **H1 (nudge):** When most inputs follow a known pattern and only some are messy, run the cheap
  exact path first and fall back to AI for the remainder. Then validate whatever the AI returns.
- **H2 (structural):** Separate "who produces the answer" from "who is allowed to act on it." AI
  can produce a draft; a rule or a human should gate any exact or high-stakes action.
- **H3 (near-answer):** Deterministic-first keeps 95% of high-volume traffic off the paid AI
  call; AI handles the messy 5%; and a validator keeps every result exact and repeatable. That
  combination is both cheapest and safest.

## FAQ

**Q: Isn't sending everything to AI simpler and more consistent?**
It is simpler to write but not cheaper, faster, or safer. At high volume the per-call cost and
latency add up, and you still need to validate exact outputs. A deterministic-first design with
validation is usually both cheaper and more reliable.

**Q: How do I keep an AI classifier inside a fixed set of labels?**
Constrain the prompt/output to the allowed set, validate the returned label against that set in
code, and fall back to a safe default ("Other", "needs human") when the answer is off-list or
low-confidence.

**Q: Why not just unit-test the AI step like everything else?**
Because the same input can give different output, an exact unit test will be flaky. Measure a
rate over a representative eval set (accuracy, or how often the output passes your validators)
against a threshold, and re-run it whenever the model or prompt changes.

**Q: Where should a human stay in the loop?**
Wherever a wrong answer is costly or hard to reverse — payments, customer-facing decisions,
anything regulated. Let AI draft and a rule pre-filter, but keep a human approval on the
high-stakes path.
