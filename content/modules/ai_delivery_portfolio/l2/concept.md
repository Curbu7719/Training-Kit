# Managing a Portfolio in an AI-Driven Org

L1 was about delivering one project well when development is AI-driven. L2 zooms out to the
**portfolio**: the many software initiatives across teams that all now build with AI assistants,
competing for the same budget, review capacity, and leadership attention. The portfolio manager
doesn't ask "is this team shipping?" but "**given that AI has changed the economics of building,
where do we invest, what do we standardise, and what do we stop?**"

**AI lowers the cost of building — so discipline matters more, not less.** When assistants make
each initiative cheaper and faster to start, more ideas become viable and the constraint shifts
from engineering capacity to **prioritisation, review capacity, and judgement**. Cheap-to-build
is a trap if it's undisciplined: you end up with a sprawl of half-finished, lightly-reviewed
bets. Score initiatives the same way — value, feasibility, risk — and keep real **kill
discipline**, because the cost of *starting* dropping doesn't make a low-value bet worth
finishing. Beware the sunk-cost trap dressed up as "but the AI already built most of it."

**Invest in shared capability, don't let every team reinvent the AI workflow.** Left alone,
every team sets up its own coding-assistant config, its own prompt and pattern library, its own
way of security-scanning generated code, its own review automation. At org scale that's waste
and **inconsistent risk**. The portfolio manager decides **point solution vs shared platform**:
fund the common machinery **once** — golden patterns and templates, a shared prompt/agent
library, secure-by-default CI that scans generated code, review automation, and an internal
platform — so every team ships faster *and* safer, and every future initiative inherits it. This
is build-vs-buy applied at the portfolio level.

**Measure real productivity gains, not vanity.** AI makes activity metrics explode, so leadership
hears "we generated 2× the code" and assumes 2× the value. That's a vanity metric. Build a
portfolio view on **real delivery**: cycle time and lead time, change-failure and defect-escape
rates, and value delivered against each initiative's agreed outcome (DORA-style signals, not
lines of code, PR counts, or "AI adoption %"). The honest report shows where AI-driven
development actually moved outcomes and where it just moved numbers.

**Govern AI-generated code across the portfolio.** Speed without governance multiplies risk. At
portfolio scale you need consistent guardrails for *every* team's generated code: security
scanning, dependency and license/IP compliance, and a clear human-accountability policy for what
merges. Without it, one team's insecure or licensed-code shortcut becomes an
organisation-wide liability — and AI-driven speed makes it spread faster.

**Vendor concentration and exit.** An org that quietly standardises every team on one coding
assistant or model provider carries concentration risk: a price change, an outage, a model
deprecation, or a quality regression now hits **all** delivery at once. Manage it at the
portfolio level — favour a provider abstraction where practical, know the switching cost, and
hold a deliberate **exit strategy** rather than discovering the lock-in during a crisis.

**The maturity roadmap.** Underneath the bets is a trajectory the portfolio manager owns: moving
the organisation from **ad-hoc individual AI use**, to a **standardised AI-augmented SDLC** with
a shared platform and guardrails, to a **governed, measured** practice where AI is woven into how
the org ships software. Maturity is about process, platform, and people — the shared capability
and governance that make each new initiative cheaper and safer than the last — not about which
assistant is the newest.

## How each role uses this

- **Developer/Engineer:** Builds the shared platform capabilities (golden patterns, prompt/agent
  library, secure CI, review automation) so teams stop reinventing the AI workflow, and surfaces
  per-initiative cycle time and defect data for the portfolio view.
- **Business Analyst:** Defines the value and feasibility scores that rank initiatives, and
  separates real productivity gains (cycle time, defect rate, value) from output vanity.
- **PM/Product Owner & Portfolio Manager:** Prioritises and sequences the bets, holds kill
  discipline despite cheap builds, decides point-vs-platform investment, and reports real
  throughput and risk to leadership.
- **QA & Architect:** Designs the cross-team guardrails for generated code (security, dependency/
  license compliance), the provider abstraction and exit strategy, and the enforced patterns that
  keep quality consistent across the portfolio.
