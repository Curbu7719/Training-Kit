# Worked Example: A Business Case That Survives Scaling

**The pilot looked great.** An insurance firm pilots an AI assistant that summarises claim
files for adjusters. With ten adjusters over three weeks, average review time drops 30% and
adoption is strong. A junior analyst proposes scaling to all 300 adjusters immediately, citing
"30% faster" as the headline.

**Building the real business case.** A business analyst rebuilds the case as a comparison, not a
headline. **Baseline:** each adjuster spends 12 hours/week on file review. **Delta:** 30%
saved is ~3.6 hours/week. **Total cost to deliver:** per-summary inference cost, plus a
crucial line item the pilot hid — a senior adjuster spends two hours a week checking summaries
for accuracy because a wrong summary can mis-price a claim. The net delta is real but smaller
than the headline once oversight cost is counted.

**Checking unit economics at scale.** At ten users the inference bill was trivial. The team
models **cost per reviewed claim** at 300 users and confirms it stays well below the labour
saved — the economics hold. Good: scaling will not invert the value.

**Watching leading indicators.** Rather than wait for the lagging "quarterly cost reduced"
number, they track **draft acceptance rate** and **time-to-first-value** for each newly
onboarded adjuster. In the first wave of 50, acceptance dips and onboarding is slow — a signal
that training is lagging the rollout.

**Acting before adoption collapses.** They pause the rollout, strengthen onboarding and the
feedback loop, and only then continue. Adoption recovers across all 300. The contrast with a
sibling project — scaled on raw "summaries generated," which never tied to faster reviews and
quietly burned budget — makes the lesson concrete: a defensible case, real unit economics, and
leading indicators are what let scaling create value instead of destroying it.
