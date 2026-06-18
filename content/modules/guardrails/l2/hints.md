# Hints — Guardrails (L2)

## Alternative phrasings of the core idea

- Treat guardrails as a pipeline with pre-action, in-action, and post-action control points,
  and place each control where it has the most context at the lowest cost.
- Every guardrail decision trades off safety, developer velocity (false positives), and
  cost/latency — mature designs tune this per risk tier, not with one blunt setting.
- Indirect prompt injection rides in on data the agent reads (issues, dependency files,
  source it opens), so input validation alone can never be sufficient.

## Hint stack

- **H1 (nudge):** Ask *where* in the agent's lifecycle a control runs and *what it can see*
  there. A check can only block what it actually inspects.
- **H2 (structural):** Indirect injection hides instructions in repo or tool content, so a
  pre-action issue check is blind to it. Which layers act *around* and *after* the agent —
  and what do they constrain?
- **H3 (near-answer):** Least-privilege sandboxing (the agent can't read `.env` or reach the
  network) plus post-action secret scanning and human review contain the threat even when
  the injection lands, because no single layer is trustworthy alone.

## FAQ

**Q: If we validate the issue text, why add more layers?**
Because injection can arrive in files the agent reads, not the issue. Input validation never
inspects that content, so independent in-action and post-action controls are still required.

**Q: What is the cost of being too strict?**
Over-blocking. A command filter that refuses safe operations slows developers and tempts them
to disable the agent or weaken its rules — which is why blocked actions are logged and tuned,
not just stacked higher.

**Q: Why sandbox least-privilege if the model is well-behaved?**
Because a successful injection or a plain mistake should still be harmless. If the agent
cannot read secrets or reach the network, it cannot exfiltrate or destroy anything regardless
of what it was tricked into "deciding."

**Q: Are guardrails ever 'finished'?**
No. New injection and bypass patterns appear over time, so teams monitor, log, red-team, and
update deny lists, sandbox scopes, and review thresholds continuously.
