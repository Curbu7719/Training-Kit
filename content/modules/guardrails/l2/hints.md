# Hints — Guardrails (L2)

## Alternative phrasings of the core idea

- Treat guardrails as a pipeline with pre-model, in-model, and post-model control points,
  and place each control where it has the most context at the lowest cost.
- Every guardrail decision trades off safety, usefulness (false positives), and
  cost/latency — mature designs tune this per risk tier, not with one blunt setting.
- Indirect prompt injection rides in on data the model reads (documents, pages, tool
  results), so input validation alone can never be sufficient.

## Hint stack

- **H1 (nudge):** Ask *where* in the request lifecycle a control runs and *what context*
  it has there. A check can only block what it can actually see.
- **H2 (structural):** Indirect injection hides instructions in fetched/tool content, so a
  pre-model input check is blind to it. Which layer sees the model's actual output?
- **H3 (near-answer):** Output moderation (post-model) is the layer positioned to catch an
  unsafe *generated* result; combine it with "treat retrieved content as untrusted" and
  monitoring, because no single layer is trustworthy alone.

## FAQ

**Q: If the system prompt says "ignore injected instructions," why add more layers?**
Because system-prompt resistance is probabilistic, not guaranteed. A reframed jailbreak may
still slip through, so an independent post-model check is needed as backup.

**Q: What is the cost of being too strict?**
Over-blocking. Aggressive filters create false positives that frustrate users, reduce
trust, and can push people toward unsafe workarounds — which is why over-blocking is logged
and tuned, not ignored.

**Q: Why treat tool results and retrieved documents as untrusted?**
Because they can carry hidden instructions (indirect prompt injection). Constrain what
actions the model can trigger from them and moderate the resulting output.

**Q: Are guardrails ever 'finished'?**
No. New jailbreak and injection patterns appear over time, so teams monitor, log, red-team,
and update deny lists, prompts, and thresholds continuously.
