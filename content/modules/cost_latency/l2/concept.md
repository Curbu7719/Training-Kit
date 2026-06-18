# Cost, Latency & Performance — Going Deeper

At L1 you learned the core relationships: cost ≈ tokens × per-token price (input and
output priced separately), the main latency drivers, the optimization levers, and the
quality/cost/latency triangle. L2 sharpens this into the metrics and decisions you make
when a feature runs at real scale.

**Latency is two numbers, not one.** Streaming systems are measured by
**time-to-first-token (TTFT)** — how long until the first token appears — and
**inter-token latency** (or tokens-per-second) once generation starts. Total time ≈
TTFT + (output tokens ÷ tokens-per-second). This matters because the levers hit
different terms: streaming improves *perceived* speed by surfacing a low TTFT, while
shortening output reduces the second term. A feature can have great TTFT but feel slow
if it generates 2,000 tokens at a low token rate.

**Caching is more than one thing.** *Prompt/prefix caching* lets you reuse the
processing of a stable prompt prefix (system instructions, few-shot examples,
long shared context) at a reduced input rate — high-value when the prefix is large and
repeated. *Response caching* skips the model entirely for identical or
semantically-similar requests. They compose: cache responses where you can, and prefix-
cache the rest.

**Routing and cascades.** Beyond a fixed "small vs. large" split, a **cascade** tries a
cheap model first and escalates to a larger one only when a confidence or validation
check fails. This pays off when most requests are easy: you pay the large-model price
only on the hard minority, lowering *average* cost while preserving quality on hard cases.

**Throughput vs. latency.** Batching and high concurrency raise **throughput**
(requests served per second, lowering unit cost) but can *raise* per-request latency if
work queues. Interactive features optimize for latency; offline/bulk jobs optimize for
throughput. The same model can serve both with different settings.

**Total cost is more than the model call.** A single user action may fan out into
multiple LLM calls (retrieval reranking, tool use, a final synthesis, plus retries on
failure). Budget the *whole pipeline per user action*, not one call — retries and
multi-step chains are a common source of surprise cost and latency.

**Measuring before tuning.** You cannot optimize what you do not log. Track input
tokens, output tokens, TTFT, total latency, and calls-per-action, broken down by
feature and model. Most "the bill is too high" problems are explained by one runaway
feature or an uncapped output, visible only once you measure.

## How each role uses this

- **Developer/Engineer:** Logs TTFT, token rate, and per-action call counts; implements
  prefix caching, response caching, and cascades, and load-tests for queueing effects.
- **Business Analyst:** Builds a cost model over the full per-action pipeline (including
  retries and multi-step calls), not a single call, to forecast spend accurately.
- **PM/Product Owner:** Chooses latency targets in terms users feel (TTFT for chat) and
  decides which features justify cascades or larger models versus aggressive trimming.
- **QA & Architect:** Sets separate SLOs for interactive vs. batch paths, tests cascade
  escalation and retry behaviour under load, and ensures observability covers every
  call in a fan-out.
