# AI Risk & Governance in Depth: Operating a Governance Program

At L1 you learned the groups of AI risk and the controls that answer them. At L2 the question
changes from *which controls exist* to *how you run governance as a program* — one that works
across many AI uses, satisfies auditors, and adapts as the rules and the technology change.

**Risk tiering, not one single rule.** Governing every AI use the same way either over-blocks
low-risk experiments or under-protects high-risk ones. Mature programs **tier** each use —
that is, sort it by risk level. An internal brainstorming aid is low tier and needs little
gating. A tool that makes customer-facing or regulated decisions (credit, hiring, health) is
high tier and needs approval gates, human oversight, bias testing, and an audit trail. The
**AI use register** records the tier, so the strength of the controls matches the exposure.

**The trade-off triangle.** Each governance decision balances three good things that pull
against each other: **risk reduction** (protect data, follow the rules, avoid harm), **speed
of adoption** (do not bury teams in process — heavy gating drives "shadow AI," where staff use
tools off the books), and **cost** (every review, log, and contract has a price). Governance
means making this trade-off *clearly and per tier*, then revisiting it.

**Where the hard ownership questions live.** Two issues come up again and again in real
programs:

- **IP & licensing.** Who owns model output depends on the contract and on the country. Some
  output may not be copyrightable at all, and rights to training data may be disputed. The
  control is a negotiated contract plus a record of which tool produced which item.
- **Accountability.** When an AI-influenced decision is challenged, you must show *who decided,
  on what basis, and with what oversight*. That is why audit logging and a human-in-the-loop
  record (a record that a person reviewed it) are not optional for high-tier uses.

**Failure modes to design against.**

- **Shadow AI:** governance so heavy that staff go around it, so risky use happens with no
  record — the register goes stale and the exposure becomes invisible.
- **Rubber-stamp oversight:** a person "reviews" output without really looking, so the
  human-in-the-loop control exists only on paper.
- **Governance as a one-time gate:** approving a tool at launch but never checking it again as
  the vendor, the data, or the law changes.

**Operating it over time.** A governance program never stops: watch for new AI uses, keep the
register current, re-tier uses as they change, follow updates to the rules (the EU AI Act,
sector rules, GDPR/KVKK), and feed incidents and near-misses back into the policy. The goal is
a living system where every AI use is visible, owned, and matched to its risk.

## How each role uses this

- **Governance:** Defines the risk-tiering criteria, keeps the register current as uses change, owns the risk-vs-speed-vs-cost trade-off per tier, and prevents shadow AI by making the approved path faster than the workaround.
- **Security Engineer:** Red-teams for leakage and abuse (attacks the system on purpose to find holes), and builds the controls (PII removal, access limits, tamper-evident logs) that make governance enforceable at scale.
- **Enterprise Architect:** Designs the audit trail so AI-influenced decisions stay explainable and defensible when challenged.
- **Project Manager:** Brings new AI uses into the register instead of letting them go shadow, and plans the oversight work per risk tier.
- **Developer:** Instruments uses so they appear in the register automatically, and checks that oversight is real rather than rubber-stamped.
