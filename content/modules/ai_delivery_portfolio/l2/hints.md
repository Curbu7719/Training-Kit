# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "Manage an AI portfolio like a venture portfolio: many small staged bets, most killed early,
  a few scaled — and prioritise by value × feasibility × risk, not by which demo was loudest."
- "The portfolio's health comes from stopping things; fund in stages so a weak bet costs little,
  reallocate freed budget, and beware the sunk-cost trap of continuing a pilot for what it has
  already cost rather than what it will return."
- "When several initiatives need the same plumbing — eval, guardrails, prompt registry, cost/
  quality observability — fund it once as a shared platform instead of letting every team
  rebuild it; that's build-vs-buy at the portfolio level and it lowers the cost of every future
  pilot."

**Hint stack**

- **H1 (nudge):** Stop thinking about one pilot and think about the whole set competing for one
  budget. The two key moves are almost always *what do we kill* and *what do we stop building
  twice*.
- **H2 (structure):** Sort the initiatives. No value metric → kill candidates. Same capability
  built in two places → platform candidates. Blocked by compliance → park behind the gate.
  Proven value → fund to scale. Then report the aggregate, not the activity.
- **H3 (worked path):** Two pilots have no business metric → kill them (freed budget, not
  failure). Two more rebuild the same eval+guardrail plumbing → fund it once as shared platform.
  One is gated on compliance → fund only the gate-clearing work. One is proven → scale it.

**Short FAQ**

- **Why kill a pilot that's half-built?** Because the decision should be about future return,
  not past cost. A half-built pilot with no value metric will still have no value finished;
  continuing it is the sunk-cost trap, and the freed budget buys a better bet.
- **When is a shared platform worth it over point solutions?** When several initiatives need the
  same capability (eval, guardrails, observability, prompt management). Funding it once makes
  every current and future pilot cheaper and more consistent; for a one-off need, a point
  solution is fine.
- **What's a portfolio-level vanity metric?** Anything that measures activity rather than
  outcome — "number of AI pilots," "prompts run," "models deployed." Report value delivered,
  spend, and adoption instead.
- **Why is vendor concentration a portfolio risk?** If every initiative quietly standardises on
  one provider, a single price change, outage, or model deprecation hits the whole portfolio at
  once. A provider abstraction and a deliberate exit strategy contain that.
