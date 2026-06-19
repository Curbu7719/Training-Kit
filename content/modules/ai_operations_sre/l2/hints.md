# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "At scale you stop improvising incidents and classify them — provider outage, quality
  regression, cost runaway, safety bypass — each with a runbook, and every production failure
  becomes a new eval case so the offline suite catches it next time."
- "The model is a dependency you don't control: it gets deprecated and changes behavior, so you
  pin versions, treat prompts as versioned artifacts, and migrate via shadow → canary → flagged
  rollout with rollback ready."
- "FinOps at scale means attributing cost by feature and tenant, alerting on anomalies (deviation
  from trend) not just fixed thresholds, and deciding per feature whether crossing a cap should
  degrade or hard-fail."

**Hint stack**

- **H1 (nudge):** Think about what changes *over time and at volume*: the model gets deprecated,
  spend spreads across teams, and you can't keep every trace. The answer is usually a deliberate
  process, not a one-off fix.
- **H2 (structure):** For a model change, the safe path is always shadow (compare offline + copy
  of traffic) → canary (small cohort, watch online monitors) → full rollout with a flag-flip
  rollback. For cost, separate attribution (who spent) from control (soft vs hard cap).
- **H3 (worked path):** A forced deprecation: don't hope the new version matches — shadow it
  against the eval set and real traffic, compare quality/cost/latency, fix regressions (e.g. cap
  a more verbose output), canary at 5%, then roll out behind a flag you can flip back.

**Short FAQ**

- **Why shadow instead of just switching the model?** The same prompt can behave differently on a
  new version, and a quality drop is silent. Shadowing compares the new version on real inputs
  before any user sees it, so you migrate on evidence, not hope.
- **Why anomaly detection if you already have a hard cap?** The cap stops catastrophe; the anomaly
  alert catches a *slow creep* or an early spike well before the cap, when it's cheap to fix. They
  cover different failure speeds.
- **Why does every incident become an eval case?** Because a unit test won't catch a non-deterministic
  regression. Turning each production failure into an offline eval case is how the regression suite
  grows teeth and the same bug can't silently return.
- **Degrade or hard-fail at the cap — which is right?** It depends on the feature. A critical,
  user-facing assistant should degrade (cheaper model or cache) to stay usable; a non-essential
  background job can hard-fail to strictly bound cost.
