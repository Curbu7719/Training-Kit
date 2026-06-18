# Designing Agents That Stay Reliable Under Autonomy

At L1 the agent loop was plan → act → observe → repeat. At L2 the question shifts from *how the loop works* to *how to keep it correct, bounded, and debuggable* when it runs in production against real systems. Autonomy doesn't fail because the idea is wrong; it fails at the edges — ambiguous tool results, partial failures, and loops that look productive but aren't.

**Tool design is the real lever.** The model can only act as well as its tools let it. Each tool needs a precise **name and description** (the model chooses tools from these alone), a **typed, validated input schema**, and a **result format the model can interpret unambiguously**. A tool that returns a raw 500 error teaches the model nothing; one that returns `{"error": "order_not_found", "retryable": false}` lets it decide intelligently. Narrow, well-named tools beat one giant "do-anything" tool.

**Loop control beyond a simple counter.** A max-iteration cap stops the worst case, but good agents also detect **non-progress**: the same tool called with the same arguments twice, or an error that won't resolve by retrying. Distinguish **transient failures** (retry with backoff) from **permanent** ones (stop and report). Without this, the loop "succeeds" at spinning.

**Compounding errors and grounding.** Because each step builds on the last observation, one bad reading propagates. Mitigations: have the model **verify against the tool result** rather than its own memory, keep observations in context so later steps can cross-check, and prefer tools that return ground truth over the model's guesses.

**Cost and latency trade-offs.** Every iteration is another model call plus a tool call. Strategies: cap iterations, run **independent tool calls in parallel**, use a **smaller model** for routine sub-steps and reserve the large one for planning, and cache tool results that don't change within a task.

**Where humans belong.** Irreversible or high-impact actions (spending money, deleting data, external communications) should sit behind a **human-approval gate** or be restricted to an allowed-tool subset. The architecture, not the prompt, enforces this — a prompt can be ignored; a permission boundary cannot.

**Observability.** You cannot debug what you cannot see. Log each iteration's plan, the tool requested, its arguments, and the observation, so a failed run can be traced step by step.

## How each role uses this

- **Developer/Engineer:** Designs typed tool schemas with interpretable error results, implements retry-vs-stop logic and parallel tool calls, and logs every iteration for tracing.
- **Business Analyst:** Specifies which actions are irreversible and must sit behind approval, and defines what a "correct" outcome looks like so non-progress can be detected.
- **PM/Product Owner:** Sets iteration and budget ceilings as product constraints, and decides the cost/latency trade-off between a faster small model and a more capable large one.
- **QA & Architect:** Designs the permission boundaries and approval gates as architecture, and tests failure modes — transient vs permanent errors, loop termination, and compounding-error recovery.
