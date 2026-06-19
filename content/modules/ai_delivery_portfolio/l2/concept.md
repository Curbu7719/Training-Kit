# Managing an AI Portfolio

L1 was about delivering one AI project well — running it as a gated experiment. L2 zooms out
to the **portfolio**: the dozen initiatives at different stages competing for the same budget,
people, and leadership attention. A portfolio manager doesn't ask "is this pilot good?" but
"**given everything we could fund, where do the next dollars and people go — and what do we
stop?**" Managed well, an AI portfolio behaves like a venture portfolio: many small bets, most
killed early, a few scaled hard.

**Prioritisation: score the bets, don't follow the hype.** New AI ideas arrive faster than you
can fund them, and the loudest demo is rarely the best bet. Score each initiative on a few
axes and sequence accordingly:

- **Value** — the size of the business outcome if it works (money, time, risk, quality), not
  how impressive the demo is.
- **Feasibility** — data, eval, and technical readiness; a high-value idea with no usable data
  is not yet fundable.
- **Risk** — governance, compliance, and reputational exposure, which may gate or delay it.

A high-value, high-feasibility, low-risk initiative is funded now; a high-value but blocked one
is parked behind its gate, not abandoned; a low-value one is declined however shiny the demo.

**Kill discipline and stage-gated funding.** The portfolio's health depends on **stopping**
things. Fund in stages — a small seed for a feasibility spike, more only as an initiative
clears each gate — so a weak bet consumes little before it's killed. Reallocate the freed
budget to better bets. The enemy is the **sunk-cost trap**: continuing a pilot because of what
it has already cost rather than what it will return. A portfolio where nothing is ever killed
is a portfolio that isn't really being managed.

**Avoid duplication; invest in shared capability.** Left alone, every team rebuilds the same
plumbing — its own model calls, its own eval harness, guardrails, prompt management, and cost
observability. At portfolio scale that's waste and inconsistent risk. The portfolio manager
decides **point solution vs shared platform**: when several initiatives need the same
capability (an eval framework, a guardrail/PII service, prompt registry, cost-and-quality
observability — the machinery from the SRE/Ops and Evaluation modules), funding it **once** as
a shared platform lowers the cost and risk of every current and future pilot. This is build-vs-
buy applied at the portfolio level, not per feature.

**Aggregate value and reporting upward.** Leadership doesn't want a pilot count — that's a
vanity metric. Build a **portfolio view** that reports, on a regular cadence to a steering
committee: value delivered (against the metrics each initiative agreed), total spend and cost
trend, adoption, and the distribution of initiatives by stage and risk tier. The job is to show
where the portfolio creates real value and where money is being spent learning that something
*won't* work — both are legitimate, but only if they're visible.

**Vendor concentration and exit.** A portfolio that quietly standardises on one provider across
every initiative carries concentration risk: a price change, an outage, or a model deprecation
now hits everything at once. Manage it at the portfolio level — favour a provider abstraction,
know the switching cost, and hold a deliberate **exit strategy** rather than discovering the
lock-in during a crisis.

**The maturity roadmap.** Underneath the bets is a trajectory the portfolio manager owns:
moving the organisation from ad-hoc experiments, to repeatable pilots, to governed production
systems, to AI woven into core operations. Maturity is about process, platform, and people —
the shared capability and governance that make each new initiative cheaper and safer than the
last — not about any single model.

## How each role uses this

- **Developer/Engineer:** Builds the shared platform capabilities (eval, guardrails, prompt
  registry, observability) so initiatives stop rebuilding them, and surfaces per-initiative
  cost and quality for the portfolio view.
- **Business Analyst:** Defines the value and feasibility scores that rank initiatives, and
  separates real portfolio value from vanity metrics in reporting.
- **PM/Product Owner & Portfolio Manager:** Prioritises and sequences the bets, runs stage-
  gated funding with real kill discipline, decides point-vs-platform investment, and reports
  aggregate value and risk to leadership.
- **QA & Architect:** Designs the shared platform and provider abstraction, and ensures the
  exit strategy and consistent guardrails hold across every initiative in the portfolio.
