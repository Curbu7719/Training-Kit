# Hints & Alternative Phrasings — L2

**Alternative phrasings of the core ideas**

- "Streaming latency is two numbers: time-to-first-comment, and the rate of tokens after
  that — total time is roughly TTFT plus output-tokens divided by token rate."
- "A cascade triages with a cheap model first and only escalates risky changes to an
  expensive one when a check fails, so you pay the high price on the hard minority of PRs."
- "Budget the whole per-PR pipeline — diff summary, code retrieval, comment drafting, and
  retries — not a single model call."

**Hint stack**

- **H1 (nudge):** Ask which *term* of the latency or cost equation a lever actually touches.
  Streaming changes perceived TTFT on the merge gate; shorter output changes generation time
  and output cost; a cascade changes *average* cost across many PRs.
- **H2 (structure):** For a cascade, write blended cost as: (fraction triaged cheap × cheap
  cost) + (fraction escalated × [cheap cost + expensive cost]). Escalated functions pay for
  *both* calls. For latency, separate interactive paths (merge gate — optimize TTFT/total)
  from batch paths (nightly bulk jobs — optimize throughput).
- **H3 (worked path):** If a small model triages 80% of changed functions and 20% escalate,
  it must be cheap *and* accurate enough that the 20% rate holds. If it skips functions that
  needed tests, you lose trust; if escalation climbs during a feature sprint, you lose the
  savings. Tune the threshold on past PRs and monitor drift.

**Short FAQ**

- **Why can batching make individual CI calls slower?** Batching and high concurrency raise
  throughput, but requests can queue, adding wait. Great for nightly bulk jobs, risky for an
  interactive merge-gate check.
- **When is prefix caching worth it?** When a large prompt prefix (coding standards,
  few-shot review examples, shared repo context) repeats across many PRs — you pay a reduced
  rate to reprocess it instead of the full input price every time.
- **Does a cascade always save money?** Only when most PRs are genuinely easy. If escalation
  is high — a refactor-heavy sprint — you pay for two calls on most functions and may end up
  pricier than going straight to the large model.
- **What's the most common cause of a surprise CI bill?** An uncapped or unexpectedly long
  review, or a check that silently fans out into many calls (plus retries) per PR. Both are
  invisible without per-PR token and call-count logging.
