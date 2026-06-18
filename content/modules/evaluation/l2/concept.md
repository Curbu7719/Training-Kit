# Evaluating AI Features in Depth: Trustworthy Measurement

L1 introduced approaches and metrics. At L2 the hard part is making the measurement itself *trustworthy* — a flawed eval is worse than none, because it gives QA and the PM false confidence and a release ships on a green number that's lying. The central questions become: is my dataset representative, is my judge reliable, and does a score change mean a real change?

**Your dataset can lie to you.** A golden set drawn only from easy, happy-path inputs reports high scores while the feature fails on the edge cases real users hit. Strong datasets are **stratified** — deliberately covering hard cases, rare categories, adversarial inputs, and known past failures. Every production bug should be distilled into a new eval case so it can never silently return; this is how a regression suite grows teeth, exactly like adding a failing test for every bug fix.

**LLM-as-judge must itself be validated.** A judge model has biases: **position bias** (favoring the first option in a pairwise comparison), **verbosity bias** (rating longer answers higher), and **self-preference** (favoring outputs from its own model family). Mitigations: validate judge scores against a sample of human ratings to measure agreement; randomize option order; use a concrete rubric, not a vague "rate 1–10." If judge-human agreement is low, the judge's numbers are noise and your CI gate is meaningless.

**Offline vs online.** Offline evals (golden datasets, run pre-release in CI) are fast, cheap, repeatable — but only as good as the data. **Online evals** — A/B tests and production signals like thumbs-up, user edits, or task completion — measure real impact but are slow and only available after shipping. Mature teams use offline as a fast gate and online as ground truth, with observability dashboards the architect designs.

**Reading scores honestly.** Because outputs are non-deterministic, a small score wobble may be noise, not signal — separate a real regression from run-to-run variance before reacting. Watch for **aggregate scores hiding subgroup failures**: an overall 90% can mask a critical category at 40%, so slice by segment. And beware optimizing a proxy until it stops reflecting real quality (**Goodhart's law**): when a measure becomes the target, it ceases to be a good measure.

## How each role uses this

- **Developer/Engineer:** Stratifies datasets, adds every production bug as a regression case, validates the judge against human labels, and slices scores by segment in CI.
- **Business Analyst:** Ensures the dataset and rubric represent real-world cases and business-critical segments, not just easy inputs.
- **PM/Product Owner:** Balances fast offline gates against slower online ground truth, and guards against optimizing a proxy metric at the expense of real user value.
- **QA/Tester & Architect:** Separates real regressions from non-deterministic noise, audits the judge for bias, designs the production observability, and ensures aggregate scores never hide a failing subgroup.
