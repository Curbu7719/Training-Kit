# Cost, Latency & Performance — Going Deeper

At L1 you learned the core relationships: cost ≈ tokens × per-token price (input and
output priced separately), the main latency drivers, the optimization levers, and the
quality/cost/latency triangle, all framed around an AI check in CI. L2 sharpens this into
the metrics and decisions you make when AI tooling runs at real team scale — across
thousands of commits, builds, and reviews a month.

**Latency is two numbers, not one.** Streaming systems are measured by
**time-to-first-token (TTFT)** — how long until the first review comment appears — and
**inter-token latency** (or tokens-per-second) after that. Total ≈ TTFT + (output tokens
÷ tokens-per-second). Streaming surfaces a low TTFT so a developer sees feedback fast;
shortening the review reduces the second term. A check can have great TTFT but still feel
slow if it emits 2,000 tokens of prose at a low token rate.

**Caching is more than one thing.** *Prefix caching* reuses the processing of a stable
prompt prefix — the coding standards, the few-shot review examples, shared repo context —
at a reduced input rate; high-value because that prefix repeats on every PR. *Response
caching* skips the model entirely when the same diff is re-reviewed (a re-run, a rebase
with no real change). They compose: response-cache where you can, prefix-cache the rest.

**Routing and cascades.** Beyond a fixed small-vs-large split, a **cascade** runs a cheap
model first and escalates to a larger one only when a confidence or validation check
fails — e.g. a small model handles a one-line config change, but a risky multi-file
refactor escalates. When most PRs are easy, you pay the large-model price only on the hard
minority, lowering *average* cost while preserving quality where it matters.

**Throughput vs. latency.** Nightly bulk jobs (re-scanning the whole codebase, generating
test stubs across many files) optimize for **throughput** via batching and concurrency,
accepting queueing. The interactive merge-gate check optimizes for latency. The same model
serves both with different settings.

**Total cost is more than one call.** Reviewing one PR may fan out into several LLM calls
— summarize the diff, retrieve related code, draft comments, plus a retry on a timeout.
Budget the *whole pipeline per PR*, not one call; retries and multi-step chains are a
common source of surprise CI spend.

**Measuring before tuning.** Track input tokens, output tokens, TTFT, total latency, and
calls-per-PR, broken down by check and model. Most "the AI tooling bill exploded" problems
trace to one runaway check or an uncapped review, visible only once you measure.

## How each role uses this

- **Developer:** Logs TTFT, token rate, and per-PR call counts; implements prefix caching, response caching, and cascades; and load-tests the check for queueing at peak.
- **Infrastructure Engineer:** Sets separate SLOs for the interactive merge gate vs nightly batch jobs, tests cascade/retry behaviour under peak load, and ensures observability covers every call in a fan-out.
- **Project Manager:** Builds a cost model over the full per-PR pipeline (retries and multi-step calls included), sets latency targets developers actually feel, and decides which checks justify a cascade or larger model.
- **Enterprise Architect:** Designs the cascade/cache architecture across the fan-out.
