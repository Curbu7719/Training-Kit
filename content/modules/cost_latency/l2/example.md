# Worked Example: A Cascade for a High-Volume Classifier

A support platform auto-tags every incoming ticket into one of 20 categories. Volume is
**500,000 tickets per month**. The first design sends every ticket to a large model.

**All-large baseline (per ticket).** Input ~300 tokens, output ~10 tokens (just a
label). At $5 / million input and $15 / million output:

`(300 × $5 + 10 × $15) ÷ 1,000,000 = $0.00150 + $0.00015 = $0.00165`

Monthly: `500,000 × $0.00165 = $825`. TTFT averages ~600 ms — fine, since tagging is
background work, but the team wants to cut cost.

**Designing a cascade.** They add a small model priced at **$0.30 / million input** and
**$1.20 / million output**, and a confidence check: if the small model's top label
clears a confidence threshold, accept it; otherwise escalate to the large model.

Measured on a sample, the small model confidently and correctly handles **80%** of
tickets; the remaining **20%** escalate.

**Cost per ticket on the small model:**
`(300 × $0.30 + 10 × $1.20) ÷ 1,000,000 = $0.00009 + $0.000012 ≈ $0.000102`

**Blended cost per ticket:**
- 80% small only: `0.80 × $0.000102 = $0.0000816`
- 20% small **then** large (both calls): `0.20 × ($0.000102 + $0.00165) = $0.00035`
- Total ≈ **$0.00043 per ticket**

Monthly: `500,000 × $0.00043 ≈ $215` — down from **$825**, roughly a **74% saving**,
while quality on the hard 20% is preserved because those still reach the large model.

**The trade-offs the team checks.**

- **Latency:** escalated tickets now make *two* calls, so their tail latency rises. Since
  tagging is asynchronous, this is acceptable; for an interactive feature it might not be.
- **Threshold tuning:** set the confidence bar too low and bad small-model labels slip
  through (quality drops); too high and too many tickets escalate (savings shrink). They
  tune it against a labelled validation set.
- **Observability:** they log escalation rate and per-tier accuracy, because if the
  ticket mix drifts, the 80/20 split — and the whole cost model — changes.
