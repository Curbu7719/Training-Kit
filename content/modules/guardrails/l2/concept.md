# Guardrails in Depth: Designing a Layered Defense

At L1 you learned that guardrails control both inputs and outputs and come in several
techniques. At L2 the question shifts from *what* a guardrail is to *how you compose and
operate them as a system* — because real attackers, real compliance audits, and real edge
cases will probe every gap.

**Guardrails as a pipeline, not a wall.** Model a request as a pipeline with distinct
control points: **pre-model** (input validation, deny-list screening, intent
classification), **in-model** (system-prompt constraints, refusal behaviour), and
**post-model** (output moderation, redaction, schema/format validation, human review).
A control should run at the point where it has the most context and the lowest cost. For
example, an obviously malicious input is cheapest to reject pre-model; a subtly unsafe
generated claim can only be caught post-model.

**The trade-off triangle.** Every guardrail decision balances three competing goods:
**safety** (block the bad), **usefulness** (don't block the good — false positives
frustrate users and erode trust), and **cost/latency** (each check adds compute and time;
human-in-the-loop adds the most). Tightening one usually loosens another. A mature design
makes this trade-off *explicitly per risk tier* rather than applying one blunt setting to
everything.

**Why input validation alone is insufficient.** Prompt injection often arrives **indirectly**
— hidden inside documents, web pages, or tool results the model reads as data, not as a
user message. You cannot reliably pre-screen content you haven't seen yet. This is why
output moderation and strict tool/permission boundaries matter: treat all retrieved or
tool-returned content as untrusted, and constrain what actions the model can trigger.

**Failure modes to design against.**

- **Over-blocking:** aggressive filters refuse legitimate requests, pushing users away or
  toward unsafe workarounds.
- **Under-blocking / bypass:** a jailbreak reframes a request ("for a novel...", "as a
  hypothetical") until a layer lets it through.
- **Guardrail as single point of failure:** if one moderation service is down or fooled,
  the whole system is exposed — hence overlapping, independent layers.

**Operating guardrails over time.** Guardrails are not set-and-forget. New jailbreak
patterns emerge, so teams **monitor, log, and red-team** continuously, then update
deny lists, prompts, and thresholds. Logging refusals and near-misses also reveals
*over-blocking*, closing the loop between safety and usefulness.

## How each role uses this

- **Developer/Engineer:** Places each control at its optimal pipeline stage, treats
  tool/retrieved content as untrusted, and instruments logging so guardrail decisions are
  observable and tunable.
- **Business Analyst:** Defines risk tiers and the acceptable false-positive vs.
  false-negative balance per tier, tracing each to a compliance or brand requirement.
- **PM/Product Owner:** Owns the safety-vs-usefulness-vs-cost trade-off, prioritizing
  where human review and stricter thresholds are justified and where they harm the product.
- **QA & Architect:** Red-teams indirect prompt injection and jailbreak reframings,
  verifies layers are independent (no shared single point of failure), and validates the
  monitoring loop that keeps guardrails current.
