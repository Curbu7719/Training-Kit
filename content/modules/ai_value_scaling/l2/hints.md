# Hints — AI Value & Scaling in Depth

## Alternative phrasings of the core idea

- A business case is a comparison: baseline (today's cost/time/error), the delta the AI
  produces, and the total cost to deliver it — including oversight, review, and change
  management — with value being delta minus total cost.
- Leading indicators (adoption depth, draft acceptance, time-to-first-value) predict the
  lagging outcome (revenue, cost) early enough to act; mature programs tie the scale-or-kill
  gate to leading indicators.
- Unit economics can invert at scale: confirm cost per unit of value stays below the benefit
  as volume grows, or scaling destroys value instead of creating it.

## Hint stack

- **H1 (nudge):** A "30% faster" headline is not the case. What is the baseline, what does the
  AI add, and what does it truly cost to run — including the human review the pilot hid?
- **H2 (structural):** Separate leading from lagging indicators. Lagging proves value but
  arrives late; leading (acceptance rate, time-to-first-value) predicts it early, so you watch
  leading at the gate and intervene before a rollout stalls.
- **H3 (near-answer):** Before scaling, model cost per unit of value at the higher volume. If
  per-request cost, support, and edge cases grow faster than benefit, the economics invert and
  scaling destroys value — the right move may be to hold or kill, not scale.

## FAQ

**Q: The pilot saved ten hours a week — isn't the case obvious?**
Not yet. Net the oversight and review cost the pilot hid. Ten hours saved that need eight hours
of human checking is a far thinner case than the headline. Value is delta minus total cost to
deliver.

**Q: Why watch leading indicators if lagging metrics are the real proof?**
Because lagging metrics arrive too late to steer by. Adoption depth, acceptance rate, and
time-to-first-value predict whether the lagging outcome will land, so you can fix a stalling
rollout before the quarter is lost.

**Q: A pilot's costs were tiny — won't they stay tiny at scale?**
Not necessarily. Per-request inference, support load, and edge-case handling can grow faster
than benefit. Model cost per unit of value at the target volume and confirm it stays below the
benefit before committing to scale.

**Q: What is pilot purgatory and how do we avoid it?**
Endless pilots that never graduate or get killed because no threshold or kill criteria were
agreed up front. Avoid it by setting the value threshold and explicit kill criteria before the
pilot, and enforcing the gate as a portfolio decision.
