# AI Value & Scaling in Depth: Building the Business Case

At L1 you learned to tell real value from vanity metrics and to move a capability through the
pilot → production → scale lifecycle, deciding to scale or kill at the gate. At L2 the
question shifts from *which stage* to *how you build a defensible business case and operate
scaling as a discipline* — because budgets, adoption curves, and unit economics will be
scrutinised the moment AI moves beyond a demo.

**The business case is a comparison, not a number.** A credible case states a **baseline**
(today's cost, time, or error rate), the **expected delta** the AI produces, and the
**total cost to deliver it** — build, run (inference and infrastructure), and the often-ignored
cost of oversight, review, and change management. Value is the delta minus that total cost. A
tool that saves ten analyst-hours but needs eight hours of human review per week has a much
thinner case than its headline suggests.

**Leading vs. lagging indicators.** Lagging metrics (revenue influenced, cost reduced) prove
value but arrive late. Leading indicators — adoption depth, draft acceptance rate, time-to-first-value
for a new user — predict whether the lagging metric will land, so you can intervene before a
rollout stalls. A mature program watches both, and ties the scale-or-kill gate to leading
indicators it can read early.

**Unit economics at scale.** A pilot's economics can invert when usage grows: per-request
inference cost, support load, and edge-case handling may all rise faster than benefit. Before
scaling, model **cost per unit of value** (e.g. cost per resolved ticket) and confirm it stays
below the benefit as volume multiplies — otherwise scale destroys value instead of creating it.

**Failure modes to design against.**

- **Pilot purgatory:** endless pilots that never graduate or get killed, because no gate or
  threshold was agreed up front — effort burns with no decision.
- **Vanity-driven scaling:** scaling on impressive-looking usage numbers that never tied to a
  business outcome, so cost grows while value does not.
- **Adoption collapse at scale:** a tool that worked for eight willing pilot users fails across
  400 because training, trust, and workflow fit did not scale with the technology.

**Operating the portfolio.** Treat AI initiatives as a portfolio: many cheap pilots, explicit
kill criteria, and budget reallocated from killed bets to proven ones. Track organisational
**maturity** — from ad-hoc experiments to governed, measured, core-operational AI — because
the constraint on value is usually process and people, not the model.

## How each role uses this

- **Portfolio Manager:** Runs the portfolio — enforces kill criteria to avoid pilot purgatory, reallocates budget from killed bets, and owns adoption at scale, not just at pilot.
- **Project Manager:** Builds the baseline-vs-delta-vs-total-cost case (including oversight and change-management cost) and defines the leading indicators tied to the scale-or-kill gate.
- **Developer:** Instruments leading indicators and per-unit cost so the business case is measured continuously, and builds systems whose unit economics hold as volume grows.
- **Enterprise Architect:** Validates that quality and cost per unit of value survive scaling, and red-teams the case against vanity-driven scaling before commitment.
