# Worked Example: When Governance Was Treated as a One-Time Gate

**The setup.** A bank governs AI well at launch. A vendor tool that helps assess loan
applications passes a full review: it is entered in the **AI use register** at "high" tier,
a contract settles output ownership and forbids training on the bank's data, bias testing is
run, and an **approval gate** signs it off. Everyone moves on.

**What changed quietly.** Eight months later, three things have shifted, and none triggered a
re-review:

- The vendor **updated its model** to a newer version with different behaviour.
- The team started feeding it **new data fields** (postal code and applicant age) that were
  not in the original assessment.
- A **new regulation** raised the bar for explainability in automated lending decisions.

**Where governance failed — and where it held.**

- **Risk tiering (stale):** *Failed.* The use was tiered once and never re-tiered, so the
  added age and postal-code fields — which can encode **bias** — were never re-assessed.
- **Contract (held, partly):** *Held* on ownership and no-training, but the contract was not
  re-checked against the model update, so new output-liability terms went unreviewed.
- **Audit logging (held):** *Held.* Because every decision was logged, the bank could later
  reconstruct which model version and which fields drove each decision — essential when the
  regulator asked.
- **Bias testing (stale):** *Failed.* It ran once at launch, not after the new fields were
  added, so a drift toward unfair outcomes went undetected for months.

**The fix the bank adopts.** They make governance **continuous**: the register entry gets a
**re-review trigger** on any model update or data-field change; bias testing is scheduled,
not one-off; and a process tracks regulatory changes and re-tiers affected uses. Human
oversight is spot-audited so it cannot quietly become a rubber stamp.

**The lesson.** The launch controls were correct but treated as a one-time gate. Real
governance is a living program: tiers, contracts, bias tests, and the register must be
re-visited as the model, the data, and the law change — otherwise yesterday's approval
silently covers today's unreviewed risk.
