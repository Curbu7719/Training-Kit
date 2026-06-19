# Operating AI in Production (SRE & Ops)

Building an AI feature gets it to "works in the demo." **Operating** it is everything that
keeps it working at 2 a.m. when you're not watching — and an LLM feature fails in ways a
normal service doesn't. The model is a **remote dependency you don't control** that can get
slower, more expensive, or quietly *worse* without a single line of your code changing.
This module is the on-call view: how you watch an AI feature, keep it reliable, keep its bill
sane, and respond when it breaks.

**A running example.** Your team has shipped an **AI support assistant** — a
retrieval-backed feature that answers customer questions inside your product, live, 24/7. It
passed every test and demoed beautifully. Now it's *in production* and it's yours to operate.
The same disciplines apply to any shipped AI feature (an in-product summarizer, an agent, a
CI reviewer): once real traffic hits it, you operate it like a service.

## Four pillars of operating an AI feature

**1. Observability — you can't fix what you can't see.** A normal request logs a status code
and a duration. An AI request needs more, because "200 OK" can still be a wrong, ungrounded,
or unsafe answer. For every call, capture a **trace**: the input, the retrieved context, the
final output, **token counts** (input + output), **latency**, and **guardrail results**. From
those you watch the **golden signals of an LLM feature**:

- **Latency** — especially **time-to-first-token (TTFT)** and **p95** total time, not just the average.
- **Error / timeout rate** — provider 5xx, rate-limit (429), and your own timeouts.
- **Cost per request** — tokens × price, trended over time.
- **Refusal rate** — how often the model declines; a sudden jump signals a prompt or policy problem.
- **Quality signals** — groundedness, user thumbs-down, edits — quality is a production metric, not just a pre-launch one.

**2. Reliability — design for the dependency failing.** Providers time out, rate-limit, and
occasionally return garbage. Operating reliably means a **degraded mode** is already wired in:
a **fallback** to a secondary provider or a cached answer, **timeouts** on every call, and
**retries with backoff** (capped, because retries cost money and add latency). The goal is
that a provider hiccup becomes a slightly worse answer, not an outage.

**3. Cost governance (FinOps) — the bill is a production signal.** LLM spend scales with
traffic and can spike from one bad change. Operating means **budget alarms**, a **hard spend
cap** or **kill-switch** for runaway cost, and **attribution** so you know *which* feature or
team is spending. A cost graph that only your finance team sees a month later is not
observability.

**4. Incident response — have a plan before you need it.** An "AI incident" looks different:
a provider outage, a **quality regression** (answers got worse after a model or prompt change),
a **cost runaway**, or a guardrail bypass in the wild. For each you want a **runbook** and,
above all, a **fast rollback** — and because you ship prompts and model choices **behind feature
flags**, rollback is a *config flip*, not an emergency redeploy.

## Two things that make AI ops different

- **Non-determinism.** The same input can produce different output, so a single bad answer
  isn't necessarily an incident — you alert on **rates and trends**, not one sample.
- **Silent regressions.** A provider can change a model, or a prompt edit can pass CI and still
  degrade real answers. Unit tests won't catch it; **online quality monitoring** does.

## How each role uses this

- **Developer/Engineer:** Instruments tracing and the golden signals, wires timeouts, retries,
  fallback, and a kill-switch, and puts prompt/model changes behind flags for instant rollback.
- **Business Analyst:** Defines which quality and cost signals reflect business impact, and the
  budget thresholds that should alarm.
- **PM/Product Owner:** Owns the SLOs and the spend cap, and decides the acceptable degraded
  experience when the provider fails.
- **QA & Architect:** Designs the observability and alerting, the failover paths, and the
  incident runbooks, and validates them under failure before they're needed in production.
