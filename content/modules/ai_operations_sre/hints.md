# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "Building an AI feature gets it working in a demo; operating it keeps it working in
  production, where the model is a remote dependency that can get slower, pricier, or quietly
  worse on its own."
- "You operate an AI feature on four pillars: observability (trace and watch the golden
  signals), reliability (timeouts, retries, fallback, degraded mode), cost governance (budget
  alarms and a hard cap), and incident response (runbooks plus fast rollback behind flags)."
- "Because outputs are non-deterministic, you alert on rates and trends — not on a single bad
  answer — and you catch silent regressions with online quality monitoring, not unit tests."

**Hint stack**

- **H1 (nudge):** Separate *building* from *running*. The question is usually about the second:
  once real traffic hits the feature, what do you watch, and what happens when the provider
  fails or the bill spikes?
- **H2 (structure):** Walk the four pillars. Observability: what's on the dashboard? Reliability:
  what's the degraded mode? Cost: where's the cap? Incident: what's the runbook and how do you
  roll back?
- **H3 (worked path):** A provider slowdown is a reliability + incident event: alert fires on
  error/latency rate → runbook says fail over to the secondary provider via a feature flag (no
  redeploy, because the model is behind an abstraction) → degrade gracefully → postmortem.

**Short FAQ**

- **Why not just page on any wrong answer?** Outputs are non-deterministic, so one bad sample is
  noise. Page on a *rate* — e.g. groundedness dropping across many requests — not a single output.
- **Why is rollback a flag flip and not a redeploy?** Because you ship the prompt and model choice
  behind a **feature flag**, reverting to the previous version is a config change that takes
  seconds, which is what you want mid-incident.
- **What's the single most valuable thing to instrument first?** End-to-end traces with tokens and
  latency. Almost every other signal (cost, p95, refusal rate, groundedness) is derived from
  having that trace data.
- **Is cost really an SRE concern?** Yes. LLM spend scales with traffic and can spike from one bad
  change, so a **budget alarm** and a **hard cap / kill-switch** are reliability controls, not just
  finance reports.
