# Worked Example: Re-Sourcing a Document-Extraction Feature as Volume Grows

**Phase: a feature that outgrew its first sourcing decision.** A fintech product extracts
fields (amounts, dates, vendor names) from uploaded invoices. A year ago, at low volume,
the team **called a hosted LLM API** behind a thin abstraction. That was the right L1 call:
fast to ship, low upfront cost, and AI genuinely fit the fuzzy, varied document layouts.

**What changed.** Volume rose from 2,000 to 900,000 invoices/month. Three pressures now
collide:

- **Cost at real volume.** The per-call price that was trivial is now the single largest
  line item — a clear TCO problem, not a sticker-price one.
- **Accuracy need rose.** Finance now auto-posts low-risk invoices, so the tolerable error
  rate dropped. The non-determinism they once absorbed with a human reviewer now needs
  tighter control.
- **Lock-in surfaced.** Their prompts and output schema are tuned to one provider's quirks.

**Re-deciding with the L2 lens.** They decompose the feature: most invoices follow a few
**known templates** where a deterministic parser is exact, cheap, and testable — so they
route those to **code**, shrinking the AI surface to genuinely novel layouts only. For that
remainder they compare options on **TCO**: a general API (rising cost), **fine-tuning** a
smaller model on the year of labeled extractions they have now accumulated (lower per-call
cost, better accuracy, but training and hosting overhead), and a specialist **buy**.

**Decision.** They **fine-tune** a smaller model for the fuzzy remainder and keep the
**abstraction layer** so the API stays a fallback. Because they had an abstraction and
portable evals from day one, switching cost is low and the move is reversible.

**The lesson.** Sourcing is not decided once. Shrinking the AI surface, pricing at real
volume, and keeping an abstraction and exit plan let the team re-source from API to
fine-tune without a rewrite — exactly the reversibility L2 is about.
