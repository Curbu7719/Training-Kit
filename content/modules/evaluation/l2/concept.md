# Evaluating AI Features in Depth: Trustworthy Measurement

L1 introduced the approaches and metrics. At L2 the hard part is making the measurement itself something you can *trust*. A broken eval is worse than no eval. It gives QA and the PM false confidence, and a release ships on a green number that is lying. The main questions become: does my dataset reflect real use, is my judge reliable, and does a change in the score mean a real change?

**Your dataset can lie to you.** A golden set built only from easy, happy-path inputs will report high scores while the feature fails on the edge cases real users hit. (A golden dataset is your saved set of test cases with trusted answers.) Strong datasets are **stratified** — they cover hard cases, rare types, tricky inputs meant to trip the system, and past failures on purpose. (Stratified means you deliberately include a mix of all the important case types, not just the common ones.) Every production bug should become a new eval case, so it can never come back unseen. This is how a regression suite grows teeth, just like adding a failing test for every bug you fix.

**LLM-as-judge must itself be checked.** (LLM-as-judge means using one AI to grade another AI's answers.) A judge model has biases: **position bias** (it favors the first option when comparing two), **verbosity bias** (it rates longer answers higher), and **self-preference** (it favors answers from its own model family). How to reduce these: check the judge's scores against a sample of human ratings to see how well they agree; shuffle the order of options; and use a clear, concrete rubric, not a vague "rate it 1 to 10." If the judge and the humans rarely agree, the judge's numbers are just noise, and your CI gate means nothing.

**Offline vs online.** Offline evals (golden datasets, run before release in CI) are fast, cheap, and repeatable — but only as good as the data. **Online evals** — A/B tests and live signals like thumbs-up, user edits, or task completion — measure real impact, but they are slow and only available after you ship. Mature teams use offline as a fast gate and online as the real truth, with monitoring dashboards that the architect designs.

**Reading scores honestly.** Because outputs are not the same every run, a small score change may be noise, not a real signal. Tell a real regression apart from normal run-to-run wobble before you react. Watch out for **aggregate scores hiding subgroup failures**: an overall 90% can hide a critical group sitting at 40%, so break the score down by segment. And beware of pushing one number so hard that it stops reflecting real quality (**Goodhart's law**): when a measure becomes the target, it stops being a good measure.

## How each role uses this

- **Tester:** Stratifies datasets, adds every production bug as a regression case, checks the judge against human labels, and breaks scores down by segment.
- **Developer:** Wires stratified evals and per-segment breakdowns into CI.
- **Project Manager:** Balances fast offline gates against slower online truth, makes sure the dataset covers business-critical segments, and guards against pushing a proxy metric at the cost of real value.
- **Enterprise Architect:** Designs production monitoring and makes sure aggregate scores never hide a failing subgroup.
