# Hints & Alternative Phrasings — L2

**Alternative phrasings of the core ideas**

- "Provider abstraction is what makes fallbacks, routing, and multi-provider failover
  possible — the model becomes a config choice, not hard-wired code."
- "Treat reliability as design, not hope: timeouts, capped retries with backoff, circuit
  breakers, and a degraded mode for every provider call."
- "Roll out prompt and model changes like code: behind flags, gradually, with offline
  eval and shadow runs first, and always a fast rollback."

**Hint stack**

- **H1 (nudge):** For any change, ask two questions — *how does this fail?* and *how do I
  undo it fast?* Reliability and rollback are part of the architecture, not afterthoughts.
- **H2 (structure):** Separate the concerns: provider abstraction (swappability),
  reliability (timeout/retry/circuit-breaker/degraded mode), guardrails (input and output
  stages), governance (what PII leaves your boundary), and rollout (flags, gradual,
  canary/shadow, rollback). A strong design names where each lives.
- **H3 (worked path):** To upgrade a model safely: make it swappable behind the
  interface, harden the call with reliability patterns, evaluate the new model on an
  offline eval set, shadow it against live traffic, then roll out gradually behind a flag
  with an instant rollback. Each step makes the change observable and reversible.

**Short FAQ**

- **Why not just deploy the new model to everyone at once?** LLM behaviour can regress in
  subtle ways unit tests miss. Gradual, flagged rollout with eval and shadow runs catches
  regressions while only a small fraction of users are exposed, and rollback is instant.
- **What is a shadow run?** Sending a copy of live traffic to a new model whose answers
  are logged but not shown to users, so you can compare real-world behaviour before
  switching.
- **What belongs in input vs. output guardrails?** Input guardrails block disallowed or
  injection-style requests and mask PII before it reaches the provider; output guardrails
  validate format, check groundedness in retrieved sources, and scan for leaked PII or
  unsafe content.
- **Why cap retries?** Unbounded retries multiply cost and latency and can hammer an
  already-struggling provider. Cap attempts and pair with a circuit breaker and a
  degraded fallback.
