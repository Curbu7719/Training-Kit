# Hints — AI Risk & Governance

## Alternative phrasings of the core idea

- AI governance is how an organisation uses AI deliberately: policies, approval gates, human
  oversight, audit logging, and an AI use register that pair each risk with an owner.
- The risks of adopting AI are categories (privacy/PII, IP & licensing, compliance, security
  & leakage, reliability, bias) — governance answers each with a specific control, not one
  blanket rule.
- Governance does not eliminate risk; it makes risk visible, assigns ownership, and keeps a
  record so AI use stays within the law, the contract, and the business's risk appetite.

## Hint stack

- **H1 (nudge):** For each risk, ask "who owns this and what control answers it?" A risk with
  no named control is the real exposure.
- **H2 (structural):** Sort controls by where they act: *before use* (acceptable-use policy,
  risk tiering, approval gate), *during use* (PII redaction, human oversight), and *after
  use* (audit log, the AI use register kept current).
- **H3 (near-answer):** Privacy/PII pairs with redaction and policy; IP & licensing with the
  vendor contract (training rights, output ownership); leakage with access scoping; bias and
  reliability with testing and human oversight; accountability with audit logging and the use
  register.

## FAQ

**Q: Isn't an acceptable-use policy enough on its own?**
No. A policy states intent, but without approval gates, redaction, logging, and a use
register, nothing enforces or records it. Governance is the policy plus the controls that
make it real.

**Q: What's the difference between IP risk and privacy risk?**
Privacy/PII risk is about personal data leaking or being processed unlawfully. IP &
licensing risk is about rights: whether training data was licensed, whether output infringes,
and **who owns** what the model produces — usually settled in the vendor contract.

**Q: Why keep an AI use register?**
Because you cannot govern what you cannot see. The register inventories where AI is used, by
whom, with what data and risk tier, so no use runs unseen and audits have a starting point.

**Q: Does governance mean a human checks every output?**
No. Human oversight is applied by risk tier — high-impact, customer-facing, or regulated uses
get human-in-the-loop review and approval gates; low-risk internal uses may not need them.
