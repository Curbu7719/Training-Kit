# AI Risk & Governance

AI creates value, but it also opens new ways for an organisation to lose money, trust, or
legal standing. **AI governance** is the set of policies, controls, and oversight an
organisation puts in place so that AI is used on purpose — within the law, within contracts,
and within the level of risk the business is willing to accept. Governance is not about
slowing teams down. It is about making the risks visible and giving each one an owner.

**The main risks.** Think of them as groups, each with a control that answers it:

- **Data privacy / PII.** PII means personal data — data that identifies a person. Staff paste
  customer names, health data, or other personal data into a tool that may store it or train on
  it, which breaks privacy law (for example GDPR/KVKK).
- **IP & licensing.** Rights to training data and ownership of output are not settled. Code or
  text the model returns may look like licensed material, and your contract may not clearly say
  **who owns the output** or whether your data can be reused.
- **Regulatory compliance.** Rules in some sectors (finance, health, hiring) may require
  decisions that can be explained and checked. A black-box model — one whose reasoning you
  cannot see — can put you out of compliance.
- **Security & data leakage.** Secret strategy, source code, or passwords sent to an outside
  service can leak, be logged, or be exposed in a breach.
- **Reliability.** Models hallucinate (make up wrong facts that sound right) and are
  non-deterministic (the same input can give different output), so an unchecked answer can be
  confidently wrong.
- **Bias & responsible AI.** Models can repeat bias in their training data, giving unfair or
  discriminatory results that carry legal and reputational cost.

**The governance controls.** Risks are managed, not removed, through layered controls:

- **Acceptable-use policy** — written rules on what data and tasks AI may be used for.
- **Approval gates** — sign-off before high-impact or customer-facing AI use.
- **Human oversight** — a person reviews AI output before anyone acts on it
  (human-in-the-loop).
- **Audit & logging** — a record of prompts, outputs, and decisions, so people can be held
  accountable.
- **AI use register** — a list of where AI is used, by whom, with what data, and at what risk
  tier (risk level), so nothing runs unseen.

No single control covers every risk. Governance pairs each risk with the control that owns it,
and reviews the whole set as the technology and the rules change.

## How each role uses this

- **Governance:** Owns the acceptable-use policy and the AI use register, sets the risk tiers, and decides which uses need an approval gate or human oversight before they ship.
- **Security Engineer:** Builds the technical controls — limiting access, removing PII, handling secrets — and keeps confidential data and passwords out of outside tools.
- **Project Manager:** Maps each AI use in the project to the data it touches and the rules that apply, and tracks the governance gates as project risks.
- **Developer:** Wires logging, access limits, and PII removal into the system so the policy is actually enforced in code.
- **Enterprise Architect:** Designs the audit trail and the oversight points so AI decisions stay explainable and accountable.
