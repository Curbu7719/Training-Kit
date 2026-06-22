# AI System Architecture & Deployment — Going Deeper

L1 introduced the reference architecture (client → orchestration → model provider, plus
vector store, tools, guardrails, observability) and the cross-cutting concerns. L2
focuses on the harder design choices: how these parts fail, how you make them
reliable, and how you roll them out safely.

**Provider abstraction in practice.** Putting the model behind an internal interface
isn't just tidy code — it's what makes **fallbacks**, **routing**, and **multi-provider**
strategies possible. (Provider abstraction means your code talks to one in-house
interface, not directly to a specific vendor.) A mature abstraction offers a stable
internal contract (input, output, token use, error types) and hides the
provider-specific details. So a main provider can fail over to a backup one, or easy
requests can route to a cheaper model, all without touching the feature code.

**Reliability patterns.** Provider APIs are remote services that time out, rate-limit,
and sometimes return broken output. Design for it: **timeouts** on every call,
**retries with backoff** for short-lived errors (wait a bit longer before each retry),
**circuit breakers** so a failing provider doesn't drag everything down (a circuit
breaker stops calling a service that keeps failing, to let it recover), and a
**degraded mode** (a backup model, a cached answer, or a polite message) instead of a
hard error. Retries add to cost and latency, so cap them.

**Guardrails as a pipeline.** Guardrails are best seen as stages, not one single check:
*input* guardrails (block disallowed or attack-style requests, and strip or mask PII
before it reaches the provider), and *output* guardrails (check the format, check the
answer is grounded in the retrieved sources, and scan for leaked PII or unsafe content).
Treat a failed guardrail as a normal, planned-for outcome with its own handling, not as
a crash.

**Data governance and privacy.** Decide on purpose what data leaves your boundary and
goes to the provider. Send as little PII as you can and mask it in prompts, follow
data-residency and retention rules, and know whether the provider may log or train on
your data. (PII is personal data that identifies someone.) The architecture should make
the PII flow clear and auditable — this is often a launch blocker, not a nice-to-have.

**Evaluation & observability as infrastructure.** You cannot improve what you cannot
measure. Trace each request end to end (the retrieved context, the prompt, the model
output, tokens, latency, guardrail results) and run an **offline eval set** against
changes before shipping. Once live, watch quality signals (groundedness, refusal rate,
user feedback), not just uptime.

**Deployment & rollout patterns.** Treat prompt and model changes like code changes.
Ship behind **feature flags**, roll out **gradually** (internal users → a small group →
everyone), and consider **canary** or **shadow** runs (send a copy of traffic to a new
model and compare it offline before switching). Always keep a fast rollback — flip a
config back to the previous model or prompt — because LLM behaviour can get worse in
subtle ways a unit test won't catch.

## How each role uses this

- **Enterprise Architect:** Designs reliability (circuit breakers, degraded modes), maintains the offline eval set, and checks failover and guardrail behaviour under failure.
- **Developer:** Builds the provider abstraction with timeouts, retries, and fallbacks, and builds the input/output guardrail stages and end-to-end tracing.
- **Security Engineer:** Documents the PII/data flow and the governance requirements that gate launch.
- **Project Manager:** Plans flagged, gradual rollouts with canary/shadow comparisons and a clear rollback plan for model or prompt changes.
- **DevOps Engineer:** Runs the canary/shadow comparison and the rollout/rollback in production.
