# Hints & FAQ (L2)

## Alternative phrasings

- At L2, the risk isn't a low score — it's a *misleading* score. A flawed eval gives false confidence, which is worse than no eval.
- Trust the measurement only when three things hold: the dataset is representative, the judge is validated against humans, and a score move is real signal rather than non-deterministic noise.
- A single high aggregate number proves nothing until you slice it — a 90% average can hide a critical category sitting at 40%.

## Hint stack

- **H1 (nudge):** Ask what could make a *good-looking* score untrustworthy. Three usual suspects: the dataset, the judge, and how you read the number.
- **H2 (structure):** Dataset → must be stratified to cover hard cases and real traffic mix, with past bugs added as regression cases. Judge → must be validated against human labels and checked for position/verbosity/self-preference bias. Reading → slice by segment so subgroups can't hide, and separate real regressions from run-to-run variance.
- **H3 (near-answer):** When an aggregate is high but users complain, slice the score by category to expose a failing subgroup; then check whether the judge over-rated those cases (often verbosity bias) by sampling human ratings; finally add the real failing cases as permanent regression tests.

## FAQ

**Why validate the LLM judge against humans?** A judge has biases — position bias (favoring the first option), verbosity bias (rating longer answers higher), and self-preference (favoring its own model family). Measuring agreement with human ratings tells you whether its scores are trustworthy or noise.

**Why stratify the dataset?** Sampling only easy, happy-path inputs reports inflated scores while real edge cases fail. Stratifying ensures hard cases, rare categories, and past failures are represented in proportion to what matters.

**What is Goodhart's law in this context?** "When a measure becomes a target, it ceases to be a good measure." Optimizing a proxy metric hard enough can improve the number while real quality stagnates or declines.

**Offline vs online evals — which wins?** Neither alone. Offline evals are a fast, cheap, repeatable pre-release gate; online evals (A/B tests, production signals) are slower but measure real-world impact. Mature teams use both — offline to catch regressions early, online as ground truth.
