# Hints & Alternative Phrasings (L2)

## Alternative phrasings

- At L2 the question isn't *how the loop works* but *how to keep it correct, bounded, and debuggable* against real systems.
- The model acts only as well as its **tools** let it: precise names/descriptions, typed validated inputs, and **interpretable result formats** (including structured errors) are the real lever.
- A guardrail enforced by **architecture** (permission boundary, approval gate) holds; a guardrail that lives only in the **prompt** can be ignored by the model.

## Hint stack

**H1 (nudge):** A simple max-iteration cap stops the absolute worst case, but what about a loop that keeps calling the same failing tool, or a model that can't tell a missing record from a temporary outage? What does the *tool* need to return for the model to act intelligently?

**H2 (design):** Reliability comes from layers on top of the L1 loop: tools with typed inputs and interpretable results (structured errors with a `retryable` flag), loop control that detects non-progress and distinguishes transient from permanent failures, grounding to limit compounding errors, cost controls (parallel calls, smaller models for sub-steps), human-approval gates for irreversible actions enforced in code, and per-iteration logging for observability.

**H3 (worked):** For a refund agent: return `{"status":"unavailable","retryable":true}` vs `{"status":"not_found","retryable":false}` so the model retries one and stops the other; detect repeated identical calls and back off instead of spinning to the cap; put large refunds behind a human-approval gate in the application (not the prompt); and log every plan/tool/args/observation so a bad run can be traced.

## FAQ

**Q: Why isn't a max-iteration limit enough to control a loop?**
It stops the worst case but not waste. An agent can call the same failing tool repeatedly until it hits the cap. Detecting **non-progress** (same tool + same args, non-retryable error) and distinguishing transient from permanent failures stops it sooner and more gracefully.

**Q: Why enforce risky actions with architecture instead of a prompt?**
A prompt is a request the model can misread or override; a malformed input can talk it into the wrong action. A permission boundary or approval gate enforced in your application **cannot** be bypassed by the model, so irreversible actions stay safe.

**Q: How do compounding errors happen, and how do I limit them?**
Each step builds on the previous observation, so one bad reading propagates through every later step. Limit it by grounding the model in actual tool results rather than its own memory, keeping observations in context for cross-checking, and preferring tools that return ground truth.

**Q: What are the main levers to control agent cost and latency?**
Cap iterations, run independent tool calls in parallel instead of sequentially, use a smaller model for routine sub-steps and reserve the large model for planning, and cache tool results that don't change within a task.
