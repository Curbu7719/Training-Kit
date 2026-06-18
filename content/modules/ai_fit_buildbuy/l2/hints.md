# Hints — AI Fit & Build vs Buy (L2)

## Alternative phrasings of the core idea

- Fit is a spectrum: decompose the feature, push every exact step into deterministic code,
  and reserve the model for the irreducibly fuzzy core to keep the system cheap, testable,
  and swappable.
- Decide sourcing on total cost of ownership at real volume — integration, evals, monitoring,
  staffing — and treat vendor lock-in and switching costs as first-class, mitigated by an
  abstraction layer and an executable exit plan.
- Sourcing is reversible, not a one-time call: re-decide as volume, accuracy needs, and data
  change, which is why minimizing the AI surface and keeping portability matter from day one.

## Hint stack

- **H1 (nudge):** Don't treat the feature as one big "AI" block. Which steps are exact lookups
  or formulas that belong in deterministic code, and which single step is irreducibly fuzzy?
- **H2 (structural):** Compare options on TCO at *real volume* — not per-call price — and ask
  what each option locks you into. An abstraction layer plus portable prompts/evals is what
  keeps the decision reversible.
- **H3 (near-answer):** Once you have accumulated labeled data and volume makes API cost the
  top line item, **fine-tuning the fuzzy remainder behind the existing abstraction** lowers
  cost and raises accuracy while keeping switching cost low.

## FAQ

**Q: We already chose call-an-API. Is sourcing settled?**
No. Sourcing is reversible and should be revisited as volume, accuracy needs, and available
data change. The L2 point is to keep the AI surface small and the integration portable so
re-sourcing (e.g. API to fine-tune) is cheap rather than a rewrite.

**Q: How do I compare a cheap API against an expensive buy fairly?**
On total cost of ownership, not sticker price. Add integration, evaluation, monitoring,
retraining, and staffing to each side — and price the API at your *real* volume, where a tiny
per-call cost can dominate.

**Q: When does fine-tuning beat calling a general API?**
When a general model is close but not accurate enough, you have accumulated labeled data, and
your volume makes the lower per-call cost of a fine-tuned model outweigh its training and
hosting overhead.

**Q: How do I keep lock-in from trapping me?**
Put the provider behind an abstraction layer, keep prompts and evaluations portable, and write
an exit plan you can actually execute. Then every option — buy, fine-tune, build, switch — stays
open at low switching cost.
