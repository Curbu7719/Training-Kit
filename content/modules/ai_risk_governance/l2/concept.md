# AI Risk & Governance in Depth: Operating a Governance Program

At L1 you learned the categories of AI risk and the controls that answer them. At L2 the
question shifts from *which controls exist* to *how you run governance as a program* — one
that scales across many AI uses, satisfies auditors, and adapts as regulation and the
technology move.

**Risk tiering, not a single rule.** Governing every AI use identically either over-blocks
low-risk experiments or under-protects high-risk ones. Mature programs **tier** each use:
an internal brainstorming aid is low tier and needs little gating; a tool that makes
customer-facing or regulated decisions (credit, hiring, health) is high tier and demands
approval gates, human oversight, bias testing, and an audit trail. The **AI use register**
records the tier so the control intensity matches the exposure.

**The trade-off triangle.** Each governance decision balances three competing goods:
**risk reduction** (protect data, comply, avoid harm), **speed of adoption** (don't smother
teams in process — heavy gating drives "shadow AI" where staff use tools off the books), and
**cost** (every review, log, and contract negotiation has a price). Governance is the act of
making this trade-off *explicitly and per tier*, then revisiting it.

**Where the hard ownership questions live.** Two issues recur in real programs:

- **IP & licensing.** Who owns model output is contract-dependent and jurisdiction-dependent;
  some outputs may not be copyrightable at all, and training data rights may be disputed. The
  control is a negotiated contract plus a record of which tool produced which artifact.
- **Accountability.** When an AI-influenced decision is challenged, you must show *who
  decided, on what basis, and with what oversight*. That is why audit logging and a
  human-in-the-loop record are not optional for high-tier uses.

**Failure modes to design against.**

- **Shadow AI:** governance so heavy that staff bypass it, so risky use happens unrecorded —
  the register goes stale and exposure becomes invisible.
- **Rubber-stamp oversight:** a human "reviews" output without real scrutiny, so the
  human-in-the-loop control exists on paper only.
- **Governance as a one-time gate:** approving a tool at launch but never re-checking it as
  the vendor, the data, or the law changes.

**Operating it over time.** A governance program is continuous: monitor for new AI uses,
keep the register current, re-tier as uses change, track regulatory updates (the EU AI Act,
sector rules, GDPR/KVKK), and feed incidents and near-misses back into the policy. The goal
is a living system where every AI use is visible, owned, and proportionate to its risk.

## How each role uses this

- **Developer/Engineer:** Builds the controls that make governance enforceable at scale —
  redaction, access scoping, tamper-evident audit logs — and instruments new AI uses so they
  surface in the register automatically rather than going shadow.
- **Business Analyst:** Defines the risk-tiering criteria, maps each use to applicable
  regulation, and keeps the register and risk classifications current as uses evolve.
- **PM/Product Owner:** Owns the risk-vs-speed-vs-cost trade-off per tier, decides where
  approval gates and human oversight are justified, and prevents shadow AI by making the
  sanctioned path faster than the workaround.
- **QA & Architect:** Red-teams for bias and leakage, verifies oversight is real rather than
  rubber-stamped, and designs the audit trail so AI-influenced decisions remain explainable
  and defensible under challenge.
