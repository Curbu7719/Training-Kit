# Cost, Latency & Performance — Going Deeper

At L1 you learned the core relationships: cost ≈ tokens × per-token price (input and output priced separately), the main latency drivers, the optimization levers, and the quality/cost/latency triangle, all framed around an AI check in CI. L2 sharpens this into the metrics and decisions you make when AI tooling runs at real team scale — across thousands of commits, builds, and reviews a month.

**Latency is two numbers, not one.** Streaming systems are measured by **time-to-first-token (TTFT)** — how long until the first review comment appears — and **inter-token latency** (or tokens-per-second) after that. (TTFT is the wait until the very first word shows up. Inter-token latency is how fast the rest of the words come after that.) Total ≈ TTFT + (output tokens ÷ tokens-per-second). Streaming shows a low TTFT so a developer sees feedback fast; making the review shorter cuts the second part. A check can have a great TTFT but still feel slow if it pours out 2,000 tokens of prose at a slow word rate.

**Caching is more than one thing.** *Prefix caching* reuses the processing of a stable opening part of the prompt — the coding standards, the few-shot review examples, the shared repo context — at a lower input price; this is high-value because that opening part repeats on every PR. *Response caching* skips the model completely when the same diff is reviewed again (a re-run, or a rebase with no real change). They work together: use response caching where you can, and prefix caching for the rest.

**Routing and cascades.** Beyond a fixed small-vs-large split, a **cascade** runs a cheap model first and moves up to a larger one only when a confidence or validation check fails. (A cascade is a chain of models from cheapest to most capable; you only climb it when needed.) For example, a small model handles a one-line config change, but a risky multi-file refactor moves up. When most PRs are easy, you pay the large-model price only on the hard few. This lowers the *average* cost while keeping quality where it matters.

**Throughput vs. latency.** Nightly bulk jobs (re-scanning the whole codebase, generating test stubs across many files) optimize for **throughput** — total work done — through batching and running many at once, and they accept some waiting in a queue. (Throughput is how much work you finish over time; latency is how long one request takes.) The interactive merge-gate check optimizes for latency instead. The same model serves both with different settings.

**Total cost is more than one call.** Reviewing one PR may fan out into several LLM calls — summarize the diff, retrieve related code, draft comments, plus a retry after a timeout. Budget the *whole pipeline per PR*, not one call. Retries and multi-step chains are a common source of surprise CI spend.

**Measuring before tuning.** Track input tokens, output tokens, TTFT, total latency, and calls-per-PR, broken down by check and model. Most "the AI tooling bill exploded" problems trace back to one runaway check or one uncapped review, and you only see them once you measure.

## How each role uses this

- **Developer:** Logs TTFT, word rate, and per-PR call counts; builds prefix caching, response caching, and cascades; and load-tests the check for queueing at peak.
- **Infrastructure Engineer:** Sets separate SLOs for the interactive merge gate vs nightly batch jobs, tests cascade and retry behaviour under peak load, and makes sure monitoring covers every call in a fan-out.
- **Project Manager:** Builds a cost model over the full per-PR pipeline (retries and multi-step calls included), sets latency targets developers actually feel, and decides which checks justify a cascade or a larger model.
- **Enterprise Architect:** Designs the cascade and cache architecture across the fan-out.
