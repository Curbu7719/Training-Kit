# Designing Agents That Stay Reliable Under Autonomy

At L1 the agent loop was plan → act → observe → repeat. At L2 the question changes. It is no
longer *how the loop works*. It is *how to keep it correct, bounded, and easy to debug* when it
runs in production against real systems. Autonomy does not fail because the idea is wrong. It
fails at the edges — unclear tool results, partial failures, and loops that look productive but
are not.

**Tool design is the real lever.** The model can only act as well as its tools let it. Each
tool needs a precise **name and description** (the model picks tools from these alone), a
**typed, validated input schema**, and a **result format the model can read clearly**. A tool
that returns a raw 500 error teaches the model nothing. A tool that returns
`{"error": "order_not_found", "retryable": false}` lets it decide wisely. Narrow, well-named
tools beat one giant "do-anything" tool.

**Loop control beyond a simple counter.** A max-iteration cap stops the worst case. But good
agents also detect **non-progress**: the same tool called with the same arguments twice, or an
error that retrying will not fix. Tell apart **transient failures** (retry, with a growing wait
between tries) from **permanent** ones (stop and report). Without this, the loop "succeeds" only
at spinning in place.

**Compounding errors and grounding.** Each step builds on the last observation, so one bad
reading spreads forward. Ways to reduce this: have the model **check against the tool result**
instead of its own memory, keep observations in context so later steps can cross-check, and
prefer tools that return real facts over the model's guesses.

**Cost and latency trade-offs.** Every iteration is one more model call plus one more tool call.
Strategies: cap iterations, run **independent tool calls in parallel**, use a **smaller model**
for routine sub-steps and save the large one for planning, and cache tool results that do not
change within a task.

**Where humans belong.** Irreversible or high-impact actions (spending money, deleting data,
sending messages to the outside) should sit behind a **human-approval gate** or be limited to an
allowed-tool subset. The architecture enforces this, not the prompt — a prompt can be ignored,
but a permission boundary cannot.

**Observability.** You cannot debug what you cannot see. Log each iteration's plan, the tool it
requested, the arguments, and the observation. Then a failed run can be traced step by step.

## How each role uses this

- **Developer:** Designs typed tool schemas with clear error results. Implements retry-vs-stop logic and parallel tool calls. Logs every iteration for tracing.
- **Enterprise Architect:** Designs the permission boundaries and approval gates as part of the architecture.
- **Security Engineer:** Says which actions are irreversible and must sit behind approval.
- **Tester:** Tests the failure modes — transient vs permanent errors, loop stopping, and recovery from compounding errors.
- **Project Manager:** Sets iteration and budget ceilings as product limits. Decides the cost/latency trade-off between a small and a large model.
