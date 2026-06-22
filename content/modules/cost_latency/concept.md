# Cost, Latency & Performance

Running a large language model (LLM) is not free and not instant. (An LLM is a computer program that has read a huge amount of text and learned how words usually go together; it predicts text.) Two practical numbers shape almost every design choice: **how much a request costs** and **how long it takes to answer**. When you understand what drives each one, you can tune a feature instead of guessing. This matters most when the AI sits inside your own software delivery lifecycle, where it runs on every commit.

**An SDLC example.** A team adds an **AI code reviewer** that runs in CI on every pull request and leaves inline comments. It runs dozens of times a day across the team. Suppose each run sends the whole diff plus thousands of lines of nearby files to a large model, and waits 30 seconds. Two things break. The CI bill climbs every sprint, and developers wait on a slow check before they can merge. The same levers that tune any LLM feature decide whether this reviewer is a help or a tax.

**Cost.** LLM use is billed per token, so a useful way to think about it is **cost ≈ tokens × per-token price**. (A token is a word or part of a word.) Providers charge **separately for input tokens** (the diff, the instructions, the retrieved code) **and output tokens** (the review comments), and output usually costs more per token.

**Latency.** This is the wait before and during the answer. (Latency just means how long you wait for a response.) Main drivers: **model size** (a bigger model reasons better but answers slower), **output length** (it writes one token at a time), **network round-trips**, and any **extra pipeline steps** — fetching files, linter calls, multi-step chains.

**Optimization levers.**

- **Prompt caching** — reuse a stable opening part of the prompt (the review rubric, the coding standards) so you do not pay to process it again on every PR.
- **Shorter outputs** — ask for only the top issues, not an essay; output drives most of the cost and time.
- **Model routing** — send a tiny diff to a small cheap model, and a big refactor to a large one.
- **Trimming context** — send only the changed parts, not the whole repository.
- **Streaming** — show comments as they arrive so the check *feels* fast.

**The trade-off triangle.** Quality, cost, and latency pull against each other. A bigger model catches more bugs but costs more and is slower. Heavy trimming is cheap and fast but can miss issues. Good engineering picks the right balance for each check, not one global setting.

## How each role uses this

- **Developer:** Measures tokens and response time on each CI assistant call, then applies caching, output caps, and routing to keep the PR check fast and within budget.
- **Infrastructure Engineer:** Sets latency SLOs for the pipeline check and tests it under peak commit load so it stays within capacity.
- **Project Manager:** Owns the AI-tooling budget, predicts monthly spend from PR volume and the input/output mix, and sets the quality/cost/latency balance.
- **Enterprise Architect:** Designs the caching and routing so the assistant stays within cost and time targets.
