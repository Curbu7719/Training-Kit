# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "An AI feature is probabilistic, so a project to deliver it is discovery-shaped — you run a
  time-boxed experiment with a pre-agreed success metric and a real willingness to kill it,
  not a fixed-scope build with a binary done."
- "You can't estimate the product because the key unknown — is the model good enough on our
  real data — is untested, so you estimate a feasibility spike first; data readiness and eval
  readiness are hard dependencies that gate everything else."
- "Done isn't 'the output equals X'; it's measurable properties — eval scores over a
  threshold, guardrails passing, cost and latency in budget, plus a human sign-off — checked
  at each stage-gate where proceed, narrow, or kill are the only honest options."

**Hint stack**

- **H1 (nudge):** Ask what's actually *unknown* about an AI feature. It's not the UI or the
  plumbing — it's whether the model is good enough on real data. The whole plan exists to
  resolve that unknown cheaply before betting big.
- **H2 (structure):** Walk the gates. Feasibility (spike on real data, measure quality) →
  pilot (real users get value) → production (monitored, owned) → scale. At each, list the
  go/no-go criteria and keep *narrow scope* and *kill* on the table.
- **H3 (worked path):** A spike returns 78% overall but 91% on the top categories. Don't ship
  78% and don't kill outright — narrow the scope to the slice that clears the bar, write
  eval-based acceptance criteria for it, and gate the rest for later.

**Short FAQ**

- **Why is killing a pilot a success?** Because a pilot is an experiment, and a clear "no"
  frees budget and people for a better bet. The failure is *not* killing a weak pilot and
  pouring more money into it because it's already funded (the sunk-cost trap).
- **Why can't I just give a delivery date?** Because the date depends on an untested unknown —
  the model's accuracy on your data. Commit to the *spike* first; commit to a launch date only
  once the spike shows the bar is reachable.
- **What makes acceptance criteria different for an AI feature?** They're statistical, not
  exact: a quality score over a threshold on a held-out set, guardrail pass rate, and cost/
  latency budgets — because there's no single correct output to assert against.
- **Isn't a risk register just normal PM hygiene?** Yes, but AI adds specific risks a normal
  project doesn't carry — data readiness, model quality, per-call cost at scale, and vendor
  dependence — so they belong on the register with named owners.
