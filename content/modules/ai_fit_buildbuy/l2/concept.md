# AI Fit & Build vs Buy in Depth: Sourcing as a Reversible Decision

At L1 you learned to ask whether AI fits a problem at all, then to choose among build, buy,
fine-tune, and call-an-API. (Fine-tune means train a ready-made model a little more on your
own data. An API lets your software use a model that someone else runs.) At L2 the question
changes from *which option* to *how you make the choice carefully and keep it reversible* —
because the wrong choice is expensive to undo, and the "right" choice changes as your usage,
your data, and your accuracy needs grow.

**Fit is a range, not a yes/no.** Break the feature into parts. Most "AI features" are partly
fixed and partly probabilistic: an exact lookup, a check, and *one* fuzzy step that truly
needs judgment. Push everything you can into **deterministic** code — code that gives the same
answer every time. It is cheaper, easy to test, and dependable. Keep the model only for the
fuzzy core that you cannot avoid. The smaller the AI part, the cheaper, easier to test, and
easier to swap the whole system becomes.

**Decide on accuracy, tolerance for non-determinism, and cost — all together.**
(Non-determinism means the same input can give different output.) These three trade off
against each other. A task that needs near-perfect accuracy and no change at all may not suit
AI, or may need a person to check each output, which adds delay and cost. A task where a
person edits the output can accept non-determinism cheaply. Always price it at **real usage**:
a penny per call is nothing at 1,000 calls a day and ruinous at 10 million.

**Sourcing is total cost of ownership, not the sticker price.** Compare options on **TCO** —
the full cost to own and run it: connecting it, writing and testing prompts, watching it,
retraining, and the staff to run it — not just the price per call or the SaaS subscription. A
"cheap" API can have a high TCO once you add test setups and on-call duty. An "expensive" buy
can be cheaper once you count the team you *did not* have to hire.

**Lock-in and switching costs matter from the start.** Every option has them. A SaaS buy ties
your workflow to a vendor's roadmap and data format. A fine-tuned model on a special platform
ties your trained model and tools to it. Even an API creates lock-in through prompts and
features that only that provider has. Reduce this with an **abstraction layer** (a thin layer
of your own code between your app and the provider), prompts and tests you can move, and an
**exit plan** you can actually carry out.

**Failure modes to design against.**

- **Forcing AI onto fixed work:** using a model where a formula or lookup belongs — slower,
  pricier, non-deterministic, and harder to test.
- **Building too early:** building in-house before AI has been shown to be what makes you
  special, when an API could have tested the idea in weeks.
- **Silent lock-in:** picking the easy vendor with no abstraction and no exit plan, so
  switching later means a rewrite.

## How each role uses this

- **Portfolio Manager:** Owns the build-vs-buy call as a TCO-and-lock-in trade-off against time-to-market, and revisits it across the roadmap as usage, data, and what makes you special change.
- **Project Manager:** States the accuracy and tolerance each step needs, ties each sourcing option to a requirement and a risk tier, and plans the decision.
- **Enterprise Architect:** Keeps the AI part small, keeps prompts and tests portable behind an abstraction, and pressure-tests the exit plan before committing.
- **Developer:** Measures real-usage cost, speed, and quality all the time so the sourcing call stays based on numbers.
