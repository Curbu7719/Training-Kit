# AI Risk & Governance

Adopting AI creates value, but it also opens new ways for an organisation to lose money,
trust, or legal standing. **AI governance** is the set of policies, controls, and oversight
an organisation puts in place so that AI is used deliberately — within the law, within
contracts, and within the risk the business is willing to accept. Governance is not about
slowing teams down; it is about making the risks visible and assigning someone to own each
one.

**The main risks.** Think of them as categories, each with a control that answers it:

- **Data privacy / PII.** Staff paste customer names, health data, or other personal data
  into a tool that may store or train on it, breaching privacy law (e.g. GDPR/KVKK).
- **IP & licensing.** Training-data rights and output ownership are unsettled. Code or text
  the model returns may resemble licensed material, and your contract may not clearly say
  **who owns the output** or whether your data can be reused.
- **Regulatory compliance.** Sector rules (finance, health, hiring) may require explainable,
  auditable decisions — a black-box model can put you out of compliance.
- **Security & data leakage.** Confidential strategy, source code, or credentials sent to an
  external service can leak, be logged, or be exposed in a breach.
- **Reliability.** Models hallucinate and are non-deterministic, so an unchecked output can
  be confidently wrong.
- **Bias & responsible AI.** Models can reproduce bias in training data, producing unfair or
  discriminatory outcomes that carry legal and reputational cost.

**The governance controls.** Risks are managed, not eliminated, through layered controls:

- **Acceptable-use policy** — written rules on what data and tasks AI may be used for.
- **Approval gates** — sign-off before high-impact or customer-facing AI use.
- **Human oversight** — a person reviews AI output before it is acted on (human-in-the-loop).
- **Audit & logging** — a record of prompts, outputs, and decisions for accountability.
- **AI use register** — an inventory of where AI is used, by whom, with what data and risk
  tier, so nothing runs unseen.

No single control covers every risk; governance pairs each risk with the control that owns
it and reviews the whole as the technology and rules evolve.

## How each role uses this

- **Governance:** Owns the acceptable-use policy and the AI use register, sets the risk tiers, and decides which uses need an approval gate or human oversight before they ship.
- **Security Engineer:** Implements the technical controls — access scoping, PII redaction, secret handling — and keeps confidential data and credentials out of external tools.
- **Project Manager:** Maps each AI use in the project to the data it touches and the regulations that apply, and tracks the governance gates as project risks.
- **Developer:** Wires logging, access scoping, and redaction into the system so the policy is actually enforced in code.
- **Enterprise Architect:** Designs the audit trail and oversight points so AI decisions stay explainable and accountable.
