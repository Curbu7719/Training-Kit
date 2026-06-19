# Operating AI at Scale — Incident Response, FinOps & Lifecycle

L1 covered the four pillars of running an AI feature: observability, reliability, cost
governance, and incident response, framed around an AI support assistant in production. L2 is
what those pillars become at real scale and over time — when one feature serves millions of
calls a month, costs spread across teams, and the model underneath **changes out from under you**.

**Incident taxonomy and runbooks.** At scale you stop improvising and classify. AI incidents
fall into recognizable classes, each with its own runbook and severity:

- **Provider outage / rate-limit** — 5xx, 429s, timeouts. Runbook: fail over to secondary
  provider, shed load, communicate status.
- **Quality regression** — answers got worse after a model or prompt change. Runbook: roll back
  the flag, then diff against the offline eval set to find what moved.
- **Cost runaway** — spend spikes from a loop, an uncapped output, or a traffic surge. Runbook:
  the hard cap or kill-switch engages; find the runaway call in the cost-by-feature breakdown.
- **Safety / guardrail bypass** — prompt injection in the wild, a PII leak, an unsafe answer.
  Runbook: tighten or fail-closed the guardrail, preserve the trace, assess blast radius.

Every incident ends in a **blameless postmortem**, and — the AI-specific twist — every
production failure becomes a **new eval case** so the offline suite can catch it next time. This
is the operational loop that ties back to evaluation: incidents grow the regression set.

**Observability that scales.** With millions of calls you can't keep every full trace forever.
**Sample** detailed traces (and always keep traces for errors and low-quality outputs), retain
**aggregates** longer, and make traces **correlatable** — a customer complaint should map to a
specific request id, its retrieved context, and the exact prompt and model version used. Online
**quality monitors** (groundedness, refusal-rate drift, thumbs-down) run continuously, because a
silent quality regression won't show up in latency or error rate at all.

**FinOps at scale.** A single budget alarm isn't enough when many teams share the spend:

- **Attribution** — tag cost by feature and tenant so you know *who* and *what* is spending.
- **Anomaly detection** — alert on a deviation from the trend, not just a fixed threshold, to
  catch a slow creep.
- **Soft vs hard caps** — a soft cap warns and throttles; a hard cap degrades (cheaper model,
  cache) or stops. Decide per feature whether crossing the cap should **degrade or fail**.
- **Capacity model** — provider quotas are finite (tokens-per-minute, requests-per-minute);
  provisioned/reserved throughput trades flexibility for guaranteed capacity and price.

**Model & prompt lifecycle.** The dependency you don't control will change. Providers
**deprecate** model versions and force a migration on a deadline; the same prompt can behave
differently on a new version. Operate it deliberately:

- **Version pinning & reproducibility** — pin the model version so behavior doesn't shift
  silently, and record which version produced which output in the trace.
- **Prompts as versioned artifacts** — prompts live in version control or a registry, reviewed
  and rolled out like code, not edited live in a console.
- **Safe upgrades** — when migrating a model, **shadow** the new version against the offline eval
  set and a copy of production traffic, compare quality/cost/latency, then **canary** to a small
  cohort before full rollout — with a flag-flip rollback ready the whole time.

**Rate limits and capacity under load.** At peak you will hit provider limits. Handle 429s with
**backoff and a queue**, **shed load** (drop or defer low-priority calls) before the system
collapses, and consider **multi-region or multi-provider** when your availability SLO is higher
than any single provider guarantees.

## How each role uses this

- **Developer/Engineer:** Implements sampled tracing, cost attribution tags, backoff/queue and
  load-shedding, version pinning, and the shadow/canary path for model upgrades.
- **Business Analyst:** Defines cost attribution dimensions and anomaly thresholds, and which
  online quality signals map to business value.
- **PM/Product Owner:** Decides degrade-vs-fail policy per feature, the availability SLO that
  justifies multi-provider cost, and accepts the migration timeline a deprecation forces.
- **QA & Architect:** Designs the incident taxonomy and runbooks, the postmortem-to-eval-case
  loop, and the shadow/canary harness, and validates failover and load-shedding under real failure.
