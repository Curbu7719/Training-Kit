# AI Value & Scaling in Depth: Building the Business Case

At L1 you learned to tell real value from vanity metrics and to move a capability through the
pilot → production → scale lifecycle, deciding to scale or kill at the gate. At L2 the question
changes from *which stage* to *how you build a business case you can defend and run scaling as
a discipline* — because budgets, adoption curves, and unit economics will be questioned the
moment AI moves past a demo.

**The business case is a comparison, not a single number.** A credible case states a
**baseline** (today's cost, time, or error rate — your starting point for comparison), the
**expected delta** (the change the AI produces), and the **total cost to deliver it** — to
build it, to run it (the cost of inference and infrastructure), and the cost people often
forget: oversight, review, and change management. Value is the delta minus that total cost. A
tool that saves ten analyst-hours but needs eight hours of human review a week has a much
weaker case than the headline suggests. (Inference is the cost of running the model each time
it answers.)

**Leading vs. lagging indicators.** Lagging indicators (revenue influenced, cost reduced) prove
value but arrive late. Leading indicators — depth of adoption, how often drafts are accepted,
time-to-first-value for a new user — predict whether the lagging indicator will land, so you
can step in before a rollout stalls. (A leading indicator hints at the future; a lagging one
confirms the past.) A mature program watches both, and ties the scale-or-kill gate to leading
indicators it can read early.

**Unit economics at scale.** Unit economics means the cost and benefit of one single unit — for
example, one resolved ticket. A pilot's economics can flip when use grows: cost per request to
run the model, support load, and edge-case handling can all rise faster than the benefit.
Before scaling, work out the **cost per unit of value** (for example, cost per resolved ticket)
and confirm it stays below the benefit as volume multiplies — otherwise scaling destroys value
instead of creating it.

**Failure modes to design against.**

- **Pilot purgatory:** endless pilots that never graduate and never get killed, because no gate
  or threshold was agreed up front — effort burns with no decision.
- **Vanity-driven scaling:** scaling on impressive-looking usage numbers that were never tied
  to a business result, so cost grows while value does not.
- **Adoption collapse at scale:** a tool that worked for eight willing pilot users fails across
  400, because training, trust, and workflow fit did not grow with the technology.

**Operating the portfolio.** Treat AI initiatives as a portfolio: many cheap pilots, clear kill
criteria, and budget moved from killed bets to proven ones. Track the organisation's
**maturity** — from one-off experiments to governed, measured, core-operational AI — because
the limit on value is usually process and people, not the model.

## How each role uses this

- **Portfolio Manager:** Runs the portfolio — enforces kill criteria to avoid pilot purgatory, moves budget from killed bets, and owns adoption at scale, not just at pilot.
- **Project Manager:** Builds the baseline-vs-delta-vs-total-cost case (including oversight and change-management cost) and defines the leading indicators tied to the scale-or-kill gate.
- **Developer:** Instruments leading indicators and per-unit cost so the business case is measured all the time, and builds systems whose unit economics hold as volume grows.
- **Enterprise Architect:** Checks that quality and cost per unit of value survive scaling, and red-teams the case against vanity-driven scaling before committing.
