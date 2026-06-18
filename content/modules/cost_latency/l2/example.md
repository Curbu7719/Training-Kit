# Worked Example: A Cascade for an AI Test-Generator in CI

A team runs an **AI test-generator** in their pipeline: on every pull request it proposes
unit tests for the changed functions. Volume is **500,000 changed-function reviews per
month** across the org. The first design sends every function to a large model.

**All-large baseline (per function).** Input ~300 tokens (the function plus a prompt),
output ~10 tokens — a quick "needs tests / already covered" triage label before any test
is drafted. At $5 / million input and $15 / million output:

`(300 × $5 + 10 × $15) ÷ 1,000,000 = $0.00150 + $0.00015 = $0.00165`

Monthly: `500,000 × $0.00165 = $825`. TTFT averages ~600 ms — fine for a background CI
step, but the team wants to cut cost.

**Designing a cascade.** They add a small model priced at **$0.30 / million input** and
**$1.20 / million output**, with a confidence check: if the small model's triage label
clears a confidence threshold, accept it; otherwise escalate the function to the large
model.

Measured on a sample, the small model confidently and correctly triages **80%** of changed
functions (trivial getters, renames, formatting); the remaining **20%** — genuinely new
logic — escalate.

**Cost per function on the small model:**
`(300 × $0.30 + 10 × $1.20) ÷ 1,000,000 = $0.00009 + $0.000012 ≈ $0.000102`

**Blended cost per function:**
- 80% small only: `0.80 × $0.000102 = $0.0000816`
- 20% small **then** large (both calls): `0.20 × ($0.000102 + $0.00165) = $0.00035`
- Total ≈ **$0.00043 per function**

Monthly: `500,000 × $0.00043 ≈ $215` — down from **$825**, roughly a **74% saving**, while
quality on the hard 20% of real logic is preserved because those still reach the large model.

**The trade-offs the team checks.**

- **Latency:** escalated functions now make *two* calls, raising their tail latency. Since
  test generation is an asynchronous CI step, this is acceptable; for an interactive
  merge-gate review it might not be.
- **Threshold tuning:** set the confidence bar too low and the small model skips functions
  that needed tests (quality drops); too high and too much escalates (savings shrink). They
  tune it against a labelled validation set of past PRs.
- **Observability:** they log escalation rate and per-tier accuracy, because if the code mix
  shifts — say a feature sprint with lots of new logic — the 80/20 split, and the whole cost
  model, changes.
