# Worked Example: Keep the Agent Reliable When It Runs Itself

Your bug-fixing agent works in the demo and then, in production, spends twenty iterations calling the same failing tool. Autonomy doesn't fail because the idea is wrong — it fails at the edges. Here's how a few design choices keep it correct, cheap, and debuggable, so you can actually leave it running.

**Tool design is the real lever.** A tool that returns a raw `500` teaches the model nothing; one that returns `{"error":"order_not_found","retryable":false}` lets it decide intelligently. *Why does this make your day easier?* The agent stops flailing on ambiguous results — narrow, well-named tools with clear errors mean it picks the right next step instead of guessing.

**Loop control beyond a counter.** A max-iteration cap stops the worst case, but you also detect **non-progress** — the same tool, same arguments, twice — and tell transient failures (retry with backoff) from permanent ones (stop and report). *Why bother?* Otherwise the loop "succeeds" at spinning and you pay for every wasted call.

**Ground each step in the tool result.** Because each step builds on the last, one bad reading propagates. You have the model verify against the actual tool output, not its own memory. *Why use the agent this way?* It's the difference between an agent that compounds one early mistake into a broken PR and one that self-corrects.

**Spend less per run.** You run independent tool calls in parallel, use a smaller model for routine sub-steps, and reserve the big model for planning. *Why?* Every iteration is another model + tool call — these choices cut the bill without cutting capability.

**Make it debuggable.** You log each iteration's plan, the tool requested, its arguments, and the observation. *Why does this save you?* When a run goes wrong you can trace it step by step instead of re-running blind.

**The takeaway:** reliable autonomy is an engineering job, not a prompt. Interpretable tools, real loop control, grounding, and per-iteration logs are what let you trust the agent enough to stop watching every step.
