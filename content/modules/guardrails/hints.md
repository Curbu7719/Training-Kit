# Hints — Guardrails

## Alternative phrasings of the core idea

- Guardrails are the safety and policy controls wrapped around a model — they check what
  goes in and what comes out, not just one or the other.
- They are the "rules of the road" for an AI system: the model can do many things, and
  guardrails decide which of those are actually allowed.
- Guardrails are layered controls (input validation, output moderation, allow/deny lists,
  system-prompt limits, human review) combined so that no single failure is catastrophic.

## Hint stack

- **H1 (nudge):** Guardrails act on *two* sides of the model. If a technique only looks at
  the user's message, what about the model's reply — and vice versa?
- **H2 (structural):** Map each technique to where it runs: *before* the model (input
  validation, deny lists), *inside* it (system-prompt constraints, refusals), or *after*
  it (output filtering, human-in-the-loop review).
- **H3 (near-answer):** The reason for using several techniques together is **defense in
  depth** — any one layer can be bypassed (e.g. by prompt injection or a jailbreak), so
  overlapping layers catch what the others miss.

## FAQ

**Q: Aren't input checks enough on their own?**
No. A clever input may slip past validation, so output filtering and other layers are
still needed. That overlap is the whole point of defense in depth.

**Q: What's the difference between prompt injection and a jailbreak?**
Prompt injection hides malicious instructions inside data the model reads (e.g. text on a
web page). A jailbreak directly tries to talk the model out of following its own rules.
Both are attacks guardrails defend against.

**Q: Is a refusal a guardrail?**
Yes. Letting the model politely decline a policy-violating request is a guardrail behaviour,
usually reinforced by system-prompt constraints.

**Q: When should a human be in the loop?**
For high-impact or high-risk responses (legal, financial, account changes) where the cost
of a wrong automated answer outweighs the cost of a human review step.
