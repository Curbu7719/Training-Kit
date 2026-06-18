# Hints & Alternative Phrasings — L2

**Alternative phrasings of the core ideas**

- "Streaming latency is two numbers: time-to-first-token, and the rate of tokens after
  that — total time is roughly TTFT plus output-tokens divided by token rate."
- "A cascade tries a cheap model first and only escalates to an expensive one when a
  check fails, so you pay the high price on the hard minority, not everything."
- "Budget the whole per-action pipeline — retrieval, tool calls, synthesis, and
  retries — not a single model call."

**Hint stack**

- **H1 (nudge):** Ask which *term* of the latency or cost equation a lever actually
  touches. Streaming changes perceived TTFT; shorter output changes generation time and
  output cost; a cascade changes *average* cost across many requests.
- **H2 (structure):** For a cascade, write the blended cost as: (fraction handled cheap ×
  cheap cost) + (fraction escalated × [cheap cost + expensive cost]). Escalated requests
  pay for *both* calls. For latency, separate interactive paths (optimize TTFT/total
  time) from batch paths (optimize throughput).
- **H3 (worked path):** If 80% of requests are handled by a small model and 20% escalate,
  the small model must be both cheap *and* accurate enough that the 20% escalation rate
  holds. If quality on easy cases drops, you lose trust; if the escalation rate climbs,
  you lose the savings. Tune the threshold on a validation set and monitor drift.

**Short FAQ**

- **Why can batching make individual requests slower?** Batching and high concurrency
  raise throughput, but requests can queue, adding wait time. Great for offline jobs,
  risky for interactive latency.
- **When is prefix caching worth it?** When a large prompt prefix (system instructions,
  few-shot examples, shared context) is reused across many calls — you pay a reduced rate
  to reprocess it instead of the full input price every time.
- **Does a cascade always save money?** Only when most requests are genuinely easy. If
  the escalation rate is high, you pay for two calls on most requests and may end up more
  expensive than going straight to the large model.
- **What's the most common cause of a surprise bill?** An uncapped or unexpectedly long
  output, or a feature that silently fans out into many calls (plus retries) per user
  action. Both are invisible without per-action token and call-count logging.
