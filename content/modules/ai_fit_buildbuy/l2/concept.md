# AI Fit & Build vs Buy in Depth: Sourcing as a Reversible Decision

At L1 you learned to ask whether AI fits a problem at all, then to choose among build, buy,
fine-tune, and call-an-API. At L2 the question shifts from *which option* to *how you make
the decision rigorously and keep it reversible* — because the wrong sourcing call is
expensive to unwind, and the "right" call changes as your volume, data, and accuracy needs
grow.

**Fit is a spectrum, not a yes/no.** Decompose the feature. Most "AI features" are part
deterministic and part probabilistic: an exact lookup, a validation, and *one* fuzzy step
that genuinely needs judgment. Push everything you can into deterministic code — it is
cheaper, testable, and gives the same answer every time — and reserve the model for the
irreducibly fuzzy core. The narrower the AI surface, the cheaper, more testable, and more
swappable the whole system becomes.

**Decide against accuracy, non-determinism tolerance, and cost — together.** These three
trade off. A task that needs near-perfect accuracy and zero variance may not suit AI at all,
or may need a human-in-the-loop gate that raises latency and cost. A task where a human
edits the output can tolerate non-determinism cheaply. Always price at **real volume**: a
penny per call is trivial at 1,000 calls/day and ruinous at 10 million.

**Sourcing as total cost of ownership, not sticker price.** Compare options on **TCO** —
integration, prompt/eval engineering, monitoring, retraining, and the staff to run it — not
the per-call API price or the SaaS subscription alone. A "cheap" API can carry a high TCO
once you add evaluation harnesses and on-call ownership; an "expensive" buy can be cheaper
once you count the team you *didn't* hire.

**Lock-in and switching costs are first-class.** Every option carries them. A SaaS buy locks
your workflow to a vendor's roadmap and data format. A fine-tuned model on a proprietary
platform locks your weights and tooling. Even an API creates lock-in through provider-specific
prompts and features. Mitigate with an **abstraction layer**, portable prompts/evals, and an
**exit plan** you can actually execute.

**Failure modes to design against.**

- **Forcing AI onto deterministic work:** a model where a formula or lookup belongs — slower,
  pricier, non-deterministic, and harder to test.
- **Premature build:** building in-house before AI is proven to be your differentiator, when
  an API would have validated the idea in weeks.
- **Silent lock-in:** picking the convenient vendor with no abstraction or exit plan, so
  switching later means a rewrite.

## How each role uses this

- **Developer/Engineer:** Minimizes the AI surface, wraps it in an abstraction with portable
  prompts and evals, and measures real-volume cost, latency, and quality continuously.
- **Business Analyst:** Specifies the accuracy and non-determinism tolerance per step and
  traces each sourcing option to a requirement and a risk tier.
- **PM/Product Owner:** Owns the build-vs-buy call as a TCO-and-lock-in trade-off against
  time-to-market, and revisits it as volume, data, and differentiation evolve.
- **QA & Architect:** Designs evaluation for a non-deterministic feature, verifies the
  abstraction keeps switching costs low, and pressure-tests the exit plan before commitment.
