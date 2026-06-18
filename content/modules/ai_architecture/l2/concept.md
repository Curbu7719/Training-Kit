# AI System Architecture & Deployment — Going Deeper

L1 introduced the reference architecture (client → orchestration → model provider, plus
vector store, tools, guardrails, observability) and the cross-cutting concerns. L2
focuses on the harder design decisions: how these pieces fail, how you make them
reliable, and how you roll them out safely.

**Provider abstraction in practice.** Putting the model behind an internal interface
isn't just tidy code — it's what makes **fallbacks**, **routing**, and **multi-provider**
strategies possible. A mature abstraction exposes a stable internal contract (input,
output, token usage, error types) and hides provider-specific details, so a primary
provider can fail over to a secondary, or easy requests can route to a cheaper model,
all without touching feature code.

**Reliability patterns.** Provider APIs are remote services that time out, rate-limit,
and occasionally return malformed output. Design for it: **timeouts** on every call,
**retries with backoff** for transient errors, **circuit breakers** so a failing
provider doesn't cascade, and a **degraded mode** (a backup model, a cached answer, or a
graceful message) instead of a hard error. Retries interact with cost and latency, so
cap them.

**Guardrails as a pipeline.** Guardrails are best seen as stages, not a single check:
*input* guardrails (block disallowed or injection-style requests, strip or mask PII
before it reaches the provider), and *output* guardrails (validate format, check the
answer is grounded in retrieved sources, scan for leaked PII or unsafe content). Treat a
failed guardrail as a first-class outcome with its own handling, not an exception.

**Data governance and privacy.** Decide deliberately what data leaves your boundary to
the provider. Minimize and mask PII in prompts, honour data-residency and retention
rules, and know whether the provider may log or train on your data. The architecture
should make the PII flow explicit and auditable — this is often a launch blocker, not a
nice-to-have.

**Evaluation & observability as infrastructure.** You cannot improve what you cannot
measure. Trace each request end-to-end (retrieved context, prompt, model output, tokens,
latency, guardrail results) and run an **offline eval set** against changes before
shipping. Online, monitor quality signals (groundedness, refusal rate, user feedback),
not just uptime.

**Deployment & rollout patterns.** Treat prompt and model changes like code changes.
Ship behind **feature flags**, roll out **gradually** (internal users → small cohort →
all), and consider **canary** or **shadow** runs (send a copy of traffic to a new model
and compare offline before switching). Always keep a fast rollback — a config flip back
to the previous model or prompt — because LLM behaviour can regress in subtle ways a unit
test won't catch.

## How each role uses this

- **Developer/Engineer:** Builds the provider abstraction with timeouts, retries, and
  fallbacks; implements input/output guardrail stages and end-to-end tracing.
- **Business Analyst:** Documents the PII/data flow and governance requirements that gate
  launch, and defines the quality signals the business cares about.
- **PM/Product Owner:** Plans flagged, gradual rollouts with canary/shadow comparisons
  and an explicit rollback plan for model or prompt changes.
- **QA & Architect:** Designs reliability (circuit breakers, degraded modes), maintains
  the offline eval set, and validates failover and guardrail behaviour under failure.
