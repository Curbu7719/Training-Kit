# Cost, Latency & Performance

Running a large language model (LLM) is not free and not instant. Two practical
numbers shape almost every design decision: **how much a request costs** and **how
long it takes to answer**. Understanding what drives each lets you tune a feature
instead of guessing.

**Cost.** LLM usage is billed per token, so a useful mental model is
**cost ≈ tokens × per-token price**. Crucially, providers charge **separately for
input tokens** (your prompt, instructions, and any retrieved context) **and output
tokens** (what the model generates), and output is usually the more expensive of the
two. So a long prompt with a short answer and a short prompt with a long answer can
cost very differently even at the same total token count.

**Latency.** This is the wait time before and during the response. The main drivers
are: **model size** (larger models reason better but respond slower), **output
length** (the model emits one token at a time, so a long answer simply takes longer),
**network round-trips**, and any **extra steps** in the pipeline — retrieval lookups,
tool or API calls, or multi-step chains each add their own delay.

**An analogy.** Think of ordering at a restaurant. Cost is the bill (priced per dish,
and the "chef's special" — output — costs more than the bread). Latency is how long
you wait: a bigger, fancier kitchen (model) is slower, a larger order (longer output)
takes longer, and every trip the waiter makes to the bar or kitchen (tool/retrieval
steps) adds minutes.

**Optimization levers.** You rarely change just one thing. Common levers:

- **Prompt caching** — reuse a stable prompt prefix so you don't pay to re-process it.
- **Shorter outputs** — cap or instruct for brevity; output tokens dominate cost and time.
- **Model routing** — send easy tasks to a smaller/cheaper model, hard ones to a large one.
- **Batching** — group many requests to improve throughput and unit cost.
- **Streaming** — show tokens as they arrive; it doesn't reduce total time but greatly
  improves *perceived* speed.
- **Trimming context** — drop irrelevant history and retrieved text to cut input cost.

**The trade-off triangle.** Quality, cost, and latency pull against each other: a
bigger model raises quality but costs more and is slower; aggressive trimming cuts
cost and latency but can hurt quality. Good engineering picks the right balance per
feature, not a single global setting.

## How each role uses this

- **Developer/Engineer:** Instruments token usage and response time per call, then
  applies levers (caching, output caps, routing) to hit a cost/latency budget.
- **Business Analyst:** Models monthly spend from input vs. output token volumes and
  flags features whose latency would hurt the user workflow.
- **PM/Product Owner:** Sets the quality/cost/latency balance per feature and decides
  where streaming or a smaller model is an acceptable trade-off.
- **QA & Architect:** Tests under load and near token limits, sets latency SLOs, and
  designs routing/caching so the system stays within cost and performance targets.
