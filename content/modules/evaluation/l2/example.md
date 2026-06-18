# Worked Example: When a 92% Eval Score Hides a Failure

A team ships a customer-support answer bot. Their offline eval over a 200-case golden dataset reports **92% accuracy** with an LLM-as-judge, and everyone is happy. Two weeks after launch, complaints spike — specifically from users asking about refunds. The high score had hidden a real failure. Here's the L2 diagnosis.

**Problem 1 — Aggregate score hid a subgroup.** The engineer slices the 92% by category. Billing, account, and how-to questions score 95–98%; **refund questions score 48%**. The dataset had only 12 refund cases out of 200, so their poor performance barely dented the average. *Fix:* the dataset wasn't stratified — refunds were underrepresented relative to real traffic.

**Problem 2 — The judge was too lenient.** They sample 30 refund answers and have humans rate them. Human-judge agreement is low: the LLM judge rated several wrong answers as acceptable because they were long and confident — **verbosity bias**. *Fix:* tighten the rubric to require a specific, correct policy reference, and randomize comparison order; re-validate against the human sample until agreement is high.

**Problem 3 — A regression that slipped through.** Checking history, refund accuracy was fine three releases ago. A prompt change meant to shorten answers had dropped a policy detail. Because no refund-specific regression case existed, nothing caught it. *Fix:* add the real failing refund questions as permanent regression cases, so this bug can never silently return.

**Step back.** They re-stratify the dataset to mirror real traffic, slice every future eval by category, validate the judge against periodic human labels, and gate releases on per-segment scores — not just the aggregate. Re-running after the prompt fix shows refunds back at 94% with no other category regressing.

**The lesson:** a single high number is not "good." Trustworthy evaluation means a representative dataset, a validated judge, regression cases mined from real bugs, and scores sliced finely enough that no critical subgroup can hide behind the average.
