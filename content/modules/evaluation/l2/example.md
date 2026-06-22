# Worked Example: Don't Let a Green Eval Score Lie to You

Your eval suite shows 90% and you ship — then real users hit the 40% of cases your dataset never had. A flawed eval is worse than none, because it hands you false confidence. At depth the job isn't running an eval; it's making the measurement *trustworthy*. Here's how that keeps you from shipping on a number that's lying.

**Your dataset can lie.** A golden set of only easy, happy-path inputs reports high scores while the feature fails where it counts. *The move:* stratify it — deliberately cover hard cases, rare categories, adversarial inputs, and every past production bug. *Why does this make your day easier?* Each bug becomes a permanent eval case, so it can never silently come back — your suite grows teeth exactly like adding a failing test per bug fix.

**Your judge can lie.** An LLM judge has biases: it favors the first option, rates longer answers higher, and prefers its own model family. *The move:* validate judge scores against a sample of human ratings, randomize option order, and use a concrete rubric. *Why bother?* If judge-human agreement is low, the judge's numbers are noise and your CI gate is meaningless — you'd be gating on randomness.

**The aggregate can lie.** An overall 90% can hide a business-critical segment sitting at 40%. *The move:* slice scores by segment instead of trusting one headline number. *Why use eval this way?* Because the average is exactly where a critical failure goes to hide.

**A score change can be noise.** Outputs are non-deterministic, so a small wobble may be run-to-run variance, not a real regression. *Why does this save you?* You stop chasing phantom drops — and you don't ship a "win" that was just luck.

**The takeaway:** at depth, the eval *is the thing under test*. Stratify the dataset, validate the judge, slice the aggregate, and separate noise from signal — so when the number says ship, it's telling the truth.
