# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "There's no single 'the AI' — there's a fleet of models differing in type (base vs
  instruction-tuned vs reasoning), size, price, and speed, and the engineering job is matching the
  right one to each task."
- "The same model behaves differently by its decoding controls: low temperature for repeatable
  code and extraction, higher for brainstorming; set max-tokens and stop sequences deliberately."
- "Pick the smallest model that reliably does the task and route only hard or low-confidence cases
  to a stronger one — that routing is the biggest lever on cost and latency across a toolchain."

**Hint stack**

- **H1 (nudge):** Ask whether every call site really needs the same brain. Autocomplete, PR
  review, and a hard design question have wildly different cost, latency, and difficulty profiles.
- **H2 (structure):** Two decisions per task — *which model* (reasoning vs fast, small vs large)
  and *which settings* (temperature, max-tokens, stop). Then one cross-cutting decision: route the
  hard cases up instead of running the big model everywhere.
- **H3 (worked path):** Completion → small fast model, low temp, stop at block end. PR review →
  mid model, escalate big diffs. Design helper → reasoning model. Don't point the reasoning model
  at completion, and don't point a tiny model at the hard design problem.

**Short FAQ**

- **Isn't the biggest model always safest?** No. It hallucinates less but still invents facts, and
  it's slower and far pricier — wasteful on routine, high-volume tasks. Match capability to need.
- **What does temperature actually change?** How focused vs varied the sampling is. Low gives
  repeatable, focused output (what you want for code); high gives creative variety (brainstorming).
- **Does temperature 0 make it deterministic?** It gets close but isn't guaranteed identical
  run-to-run, so still design tests to tolerate variation rather than assert exact strings.
- **When is a reasoning model worth it?** On genuinely hard, multi-step problems — a subtle bug, a
  design trade-off. For autocomplete or simple extraction it just adds cost and latency.
