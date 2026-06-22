# Using AI Well: Verify, Judge, Escalate

At L1 you learned the core habits: AI can be confidently wrong, what you send leaves your control, verify before it counts, watch for hidden instructions, and escalate high-stakes calls. At L2 we sharpen the judgment — *how much* to check, *how* to spot a wrong answer, and *what* you may safely put in.

**Match verification to the stakes.** Not everything needs the same check. A throwaway brainstorm needs almost none. A number in a board deck, a customer-facing answer, or anything that triggers an action needs a real check against a trusted source — and for irreversible or regulated decisions, a second human. Decide the stakes first, then choose the check.

**Spot the tell-tale signs of a wrong answer.** Hallucinations often look *more* confident and specific than the truth: a precise-sounding statistic with no source, an invented citation or link, a named API or policy that does not exist, or details from after the model's knowledge cutoff. Confidence is not correctness. If it matters and you can't trace it to a source, assume it is unverified.

**Classify what you paste.** Before sending anything, ask which tier it is: **public** (fine to send), **internal** (only the approved platform), **confidential / regulated** — PII, secrets, customer data, health or financial records (redact, or don't send). The label decides the action, so you don't have to judge it in the heat of the moment.

**Indirect instructions are the subtle risk.** "It just summarised the document" is not the same as "it's safe to act on." When AI reads content you fetched — a ticket, a web page, a PDF, an email — that content can carry instructions the AI follows as if they were yours. Treat any *action* the AI proposes off the back of external content as suspect until you confirm you actually asked for it.

**Stay accountable; escalate deliberately.** The human stays responsible for what the AI's help produces. "The AI said so" is not a defence in a review. Know your escalation path: when a task touches money, people, legal exposure, production, or regulated data, loop in the right owner (security, governance, your manager) instead of letting AI decide.

## How each role uses this

- **Everyone:** Scales checking to the stakes, recognises confident-but-wrong output, and classifies data before pasting.
- **Project Manager:** Verifies AI claims that feed a decision, and escalates anything touching scope, cost, or risk rather than acting on the draft.
- **Portfolio Manager:** Traces AI-provided numbers to a source before they shape a budget or roadmap.
- **Governance:** Defines the data tiers and escalation paths, and audits that high-stakes AI use has human sign-off.
- **Release Manager:** Keeps human review and approval as the gate; treats AI suggestions as input, never as the decision.
