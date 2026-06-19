# Worked Example: Putting an AI Support Assistant On-Call

Your **AI support assistant** is live. It answers customer questions in-product, grounded in
your help-center articles (a RAG pipeline). Building it is done; now you have to **operate**
it. Here's how a team stands it up for production and survives its first incident.

## Step 1 — Instrument the golden signals

Before anything else, every assistant call emits a **trace**: the user question, the retrieved
articles, the final answer, input/output **tokens**, **TTFT** and total **latency**, and
whether each **guardrail** passed. From those traces the team builds one on-call dashboard:

| Signal | What they watch | Why |
|---|---|---|
| p95 TTFT | < 1.5 s | The wait the user actually feels |
| Error / timeout rate | < 1% | Provider 5xx, 429s, own timeouts |
| Cost per answer | ~$0.004, trended | Catches a runaway before the invoice |
| Refusal rate | stable baseline | A jump means a prompt/policy break |
| Groundedness (sampled) | > 0.9 | Catches silent quality drift |

## Step 2 — Turn signals into SLOs and alerts

A dashboard nobody watches is useless, so the team sets **SLOs** and alerts on *breaches of
trends*, not single events:

- **Availability SLO:** 99.5% of answers return without error → page on-call if the error rate
  exceeds 2% for 5 minutes.
- **Latency SLO:** p95 TTFT < 1.5 s → warn if breached for 10 minutes.
- **Cost guardrail:** a **budget alarm** at 1.5× the daily baseline, and a **hard cap** that
  flips the feature to a cached/fallback answer if daily spend hits 3×.

Crucially they do **not** page on one ungrounded answer — outputs are non-deterministic, so a
single bad sample is noise. They alert when the *groundedness rate* drops across many requests.

## Step 3 — The first incident

Three weeks in, at 9 p.m., the on-call phone buzzes: **error rate jumped to 14%, p95 TTFT to
9 s.** The dashboard shows the provider is returning 429s and timeouts — a provider-side
slowdown, not their code.

The **runbook** for "provider degraded" is already written:

1. **Confirm scope** — it's the primary provider; the secondary is healthy.
2. **Fail over** — flip the `assistant_provider` feature flag to the secondary provider. Because
   the model sits behind a **provider abstraction**, no redeploy is needed; traffic shifts in
   seconds.
3. **Degrade gracefully** — for the few seconds of overlap, requests that error fall back to a
   "I'm having trouble — here are the top help articles" response instead of a hard error.
4. **Communicate** — post on the status channel; note start time for the postmortem.

Error rate falls back under 1% within two minutes. No customer saw an error page; a small slice
saw a slightly slower or fallback answer.

## Step 4 — Close the loop

The next morning, a **blameless postmortem**: the trigger (primary provider regional slowdown),
what worked (alert fired, failover flag worked), and one improvement (add an automatic failover
when error rate > 10% for 2 minutes, instead of waiting for a human). They file it and move on.

**The lesson.** None of this was about a smarter model. The feature stayed up because it was
**observed** (the alert fired on a real signal), **reliable** (failover was pre-wired behind a
flag), **cost-guarded** (a cap stood ready), and **operated** (a runbook turned a 2 a.m. scramble
into a two-minute flag flip). That's the difference between building an AI feature and running one.
