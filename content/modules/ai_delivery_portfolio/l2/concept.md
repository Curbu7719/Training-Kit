# Managing a Portfolio in an AI-Driven Org

L1 was about delivering one project well when development is AI-driven. L2 zooms out to the
**portfolio**: the many software initiatives across teams that now all build with AI assistants,
competing for the same budget, review capacity, and leadership attention. (A portfolio is the whole
set of projects an organisation is running at once.) The portfolio manager doesn't ask "is this
team shipping?" Instead they ask "**given that AI has changed the economics of building, where do
we invest, what do we standardise, and what do we stop?**"

**AI lowers the cost of building — so discipline matters more, not less.** When assistants make
each initiative cheaper and faster to start, more ideas become worth trying, and the limit shifts
from engineering capacity to **prioritisation, review capacity, and judgement**. Cheap-to-build is
a trap if it is undisciplined: you end up with a sprawl of half-finished, lightly-reviewed bets.
Score initiatives the same way — value, feasibility, risk — and keep real **kill discipline**.
(Kill discipline means the willingness to stop a project that is not worth finishing.) The cost of
*starting* dropping does not make a low-value bet worth finishing. Watch out for the **sunk-cost**
trap dressed up as "but the AI already built most of it." (The sunk-cost trap is when you keep going
only because you already spent time or money, even though stopping is the better choice.)

**Invest in shared capability, don't let every team reinvent the AI workflow.** Left alone, every
team sets up its own coding-assistant config, its own prompt and pattern library, its own way of
security-scanning generated code, and its own review automation. At org scale that is waste and
**inconsistent risk**. The portfolio manager decides **point solution vs shared platform**: fund
the common machinery **once** — golden patterns and templates, a shared prompt/agent library,
secure-by-default CI that scans generated code, review automation, and an internal platform — so
every team ships faster *and* safer, and every future initiative inherits it. (A point solution is
something built for one team only; a shared platform is built once for everyone. CI, continuous
integration, is the system that automatically builds and tests code.) This is build-vs-buy applied
at the portfolio level.

**Measure real productivity gains, not vanity.** AI makes activity numbers explode, so leadership
hears "we generated 2× the code" and assumes 2× the value. That is a vanity metric. (A vanity
metric is a number that looks good but does not show real value.) Build a portfolio view on **real
delivery**: cycle time and lead time, change-failure and defect-escape rates, and value delivered
against each initiative's agreed outcome (DORA-style signals, not lines of code, PR counts, or "AI
adoption %"). (Cycle time is how long work takes from start to done; defect-escape rate is how many
bugs reach users; DORA is a well-known set of delivery measures.) The honest report shows where
AI-driven development really moved outcomes and where it just moved numbers.

**Govern AI-generated code across the portfolio.** Speed without governance multiplies risk.
(Governance means the rules and checks that keep work safe and accountable.) At portfolio scale you
need consistent guardrails for *every* team's generated code: security scanning, dependency and
license/IP compliance, and a clear policy for which human is accountable for what merges. (IP means
intellectual property — who legally owns the code.) Without it, one team's insecure or
licensed-code shortcut becomes an organisation-wide liability — and AI-driven speed makes it spread
faster.

**Vendor concentration and exit.** An org that quietly puts every team on one coding assistant or
model provider carries concentration risk: a price change, an outage, a model being retired, or a
drop in quality now hits **all** delivery at once. Manage it at the portfolio level — prefer a
provider abstraction where practical, know the switching cost, and hold a deliberate **exit
strategy** rather than discovering the lock-in during a crisis. (A provider abstraction is a layer
that lets you swap one vendor for another with less rework; an exit strategy is a plan for leaving a
vendor cleanly.)

**The maturity roadmap.** Underneath the bets is a path the portfolio manager owns: moving the
organisation from **ad-hoc individual AI use**, to a **standardised AI-augmented SDLC** with a
shared platform and guardrails, to a **governed, measured** practice where AI is woven into how the
org ships software. (Ad-hoc means done case by case with no standard way; the SDLC is the whole
process of building and shipping software.) Maturity is about process, platform, and people — the
shared capability and governance that make each new initiative cheaper and safer than the last —
not about which assistant is the newest.

## How each role uses this

- **Portfolio Manager:** Prioritises and orders the bets, holds kill discipline even when builds are cheap, decides point-vs-platform investment, and reports real throughput (cycle time, defects) and risk to leadership — not lines generated.
- **Project Manager:** Tracks each initiative, plans it, and manages its risks; feeds real per-initiative delivery data into the portfolio view.
- **Release Manager:** Owns the test environments and orders releases of initiatives that depend on each other so portfolio-wide changes ship safely and in order.
- **Developer:** Builds the shared platform (golden patterns, secure CI, review automation) so teams stop reinventing the AI workflow, and surfaces per-initiative cost/quality data.
- **Governance:** Sets the cross-team guardrails for generated code (security, dependency/license compliance, human accountability) so portfolio speed doesn't multiply risk.
- **Enterprise Architect:** Designs the shared platform, the provider abstraction and exit strategy, and the patterns that keep quality consistent across the portfolio.
