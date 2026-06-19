# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "When AI makes building cheap, kill discipline and prioritisation matter *more*, not less —
  cheap-to-start is a trap if it's undisciplined, so score bets by value × feasibility × risk and
  stop the ones that don't earn their next stage."
- "Don't let every team reinvent the AI workflow; fund the shared machinery once — golden
  patterns, prompt/agent library, secure CI for generated code, review automation — so every team
  ships faster and safer and every future initiative inherits it."
- "AI inflates activity, so report real delivery (cycle time, change-failure and defect-escape
  rates, value delivered) not vanity (lines generated, PR count, 'AI adoption %'), and govern
  generated code consistently across teams or speed just multiplies risk."

**Hint stack**

- **H1 (nudge):** Stop thinking about one team and think about the whole set building with AI on
  one budget. The two key moves are almost always *what do we kill* and *what AI workflow are we
  building twice that should be a shared platform*.
- **H2 (structure):** Sort the initiatives. No real delivery signal → kill candidates. Same AI
  workflow built in two places → platform candidates. Blocked by compliance/IP → park behind the
  gate. Proven cycle-time/defect improvement → fund to scale. Then report the aggregate, not the
  activity.
- **H3 (worked path):** One bet reports "2× lines generated" with no cycle-time or defect change →
  kill it (freed budget, not failure). Two teams rebuild the same secure-scan + pattern setup →
  fund it once as a shared platform. One is gated on license/IP review → fund only the
  gate-clearing work. One has proven cycle-time gains → scale it.

**Short FAQ**

- **If AI makes building cheap, why be disciplined about killing bets?** Because cheap-to-start
  isn't cheap-to-finish-and-maintain, and a low-value bet is still low-value once built.
  Undisciplined cheap building produces a sprawl of half-reviewed initiatives; killing frees
  budget and review capacity for better bets.
- **When is a shared AI platform worth it over per-team setups?** When several teams need the same
  capability — assistant config, golden patterns, secure scanning of generated code, review
  automation. Funding it once makes every current and future team faster, safer, and more
  consistent; for a genuine one-off, a point solution is fine.
- **What's a portfolio-level vanity metric in an AI-driven org?** Anything that measures activity
  rather than outcome — "lines generated," "PRs opened," "AI adoption %." Report cycle time,
  change-failure and defect-escape rates, and value delivered instead.
- **Why is vendor concentration a portfolio risk here?** If every team quietly standardises on one
  coding assistant or model provider, a single price change, outage, deprecation, or quality
  regression hits all delivery at once. A provider abstraction and a deliberate exit strategy
  contain that.
