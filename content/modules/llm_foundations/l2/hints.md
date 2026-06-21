# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "There's no single 'the AI' — there's a fleet of models differing in type (base vs
  instruction-tuned vs reasoning), size, price, and speed, and the engineering job is matching the
  right one to each task."
- "Beyond the model choice, set the output controls deliberately — cap max output tokens and use
  stop sequences so the response is the right length and ends cleanly."
- "Pick the smallest model that reliably does the task and route only hard or low-confidence cases
  to a stronger one — that routing is the biggest lever on cost and latency across a toolchain."

**Hint stack**

- **H1 (nudge):** Ask whether every call site really needs the same brain. Autocomplete, PR
  review, and a hard design question have wildly different cost, latency, and difficulty profiles.
- **H2 (structure):** Two decisions per task — *which model* (reasoning vs fast, small vs large)
  and *which output controls* (max-tokens, stop sequences). Then one cross-cutting decision: route
  the hard cases up instead of running the big model everywhere.
- **H3 (worked path):** Completion → small fast model, capped output, stop at block end. PR review
  → mid model, escalate big diffs. Design helper → reasoning model. Don't point the reasoning model
  at completion, and don't point a tiny model at the hard design problem.

**Short FAQ**

- **Isn't the biggest model always safest?** No. It hallucinates less but still invents facts, and
  it's slower and far pricier — wasteful on routine, high-volume tasks. Match capability to need.
- **What if I need repeatable output?** Output can vary run to run, so don't assert against an
  exact string. Ask for a strict format (e.g. JSON) and validate it, and test for properties rather
  than a fixed string.
- **When is a reasoning model worth it?** On genuinely hard, multi-step problems — a subtle bug, a
  design trade-off. For autocomplete or simple extraction it just adds cost and latency.
- **Why route instead of using one strong model everywhere?** Because most calls are routine; a
  cheap model handles them, and escalating only the hard cases keeps cost and latency down without
  losing quality where it matters.
