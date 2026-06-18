# Hints — AI Risk & Governance (L2)

## Alternative phrasings of the core idea

- Run governance as a continuous program, not a one-time launch gate: tier each AI use, match
  control intensity to the tier, and re-review when the model, data, or law changes.
- Every governance decision trades off risk reduction, speed of adoption, and cost — gate too
  hard and you get "shadow AI" (unrecorded use); gate too little and high-tier risk slips
  through.
- Accountability for high-tier, regulated uses depends on audit logging and a real
  human-in-the-loop record, so a challenged decision can show who decided, on what basis, and
  with what oversight.

## Hint stack

- **H1 (nudge):** Ask whether the control is one-time or ongoing. An approval that is never
  re-checked silently covers risk that has changed since launch.
- **H2 (structural):** Sort the failure by where it lives — a stale tier (re-tier on change),
  a stale bias test (schedule it), rubber-stamp oversight (spot-audit it), or shadow AI (make
  the sanctioned path faster than the workaround).
- **H3 (near-answer):** When a high-tier use drifts after launch (new model version, new data
  fields), the root-cause fix is continuous governance: re-review triggers, recurring bias
  testing, and a register kept current — with audit logging so each decision stays
  explainable.

## FAQ

**Q: Why tier AI uses instead of governing them all the same?**
Uniform governance over-blocks low-risk experiments and under-protects high-risk ones.
Tiering matches control intensity (approval gates, oversight, bias testing) to the actual
exposure recorded in the register.

**Q: What is "shadow AI" and why does it matter?**
It is staff using unsanctioned AI tools off the books, usually because official governance is
too slow. The register goes stale and real risk becomes invisible, so the fix is to make the
sanctioned path faster, not just stricter.

**Q: Who owns the output of an AI model?**
It depends on the contract and jurisdiction; some outputs may not be copyrightable at all.
That is why output ownership and training rights are settled in a negotiated vendor contract,
with a record of which tool produced which artifact.

**Q: Is approving an AI tool at launch enough?**
No. Vendors update models, teams add data fields, and regulations change. Governance must
re-trigger on those changes — otherwise yesterday's approval covers today's unreviewed risk.
