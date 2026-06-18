# Hints & FAQ

## Alternative phrasings

- Evaluation is **what testing becomes for an AI feature**: because outputs vary and there's rarely one correct string, QA measures quality across many examples instead of asserting one exact output.
- Think of a **golden dataset** as the feature's test suite — known-good inputs and expected outputs you rerun any time to see if quality moved.
- Eval-driven iteration is the loop: change something → run the suite in CI → keep the change only if the numbers improved. The scores decide, not the demo.

## Hint stack

- **H1 (nudge):** Group the ideas. Some items are *approaches* (how you gather judgments) and some are *metrics* (what number you measure). Don't mix the two.
- **H2 (structure):** Approaches answer "who or what does the scoring?" — golden dataset, human review, LLM-as-judge, A/B test. Metrics answer "what quality are we measuring?" — accuracy, relevance, faithfulness/groundedness, latency, cost.
- **H3 (near-answer):** Match each metric to the *one* thing it measures: accuracy → is it correct; relevance → does it address the request; faithfulness/groundedness → does it stick to the supplied sources without inventing; latency → response speed; cost → spend per call.

## FAQ

**Why can't QA just write normal unit tests for an AI feature?** Because the same prompt can yield different wording each run, and there's rarely one correct string. You score properties (accurate? relevant? grounded?) across many examples, not an exact match.

**What is LLM-as-judge, and isn't it circular?** A second model scores outputs against a rubric. It's fast and scalable enough for CI, but you must validate the judge itself — e.g., spot-check its scores against human ratings — so it isn't a black box grading another black box.

**What's the difference between accuracy and faithfulness?** Accuracy asks "is the answer correct in the world?" Faithfulness (groundedness) asks "did the answer stay within the supplied sources without inventing?" An answer can be faithful to its sources yet still inaccurate if those sources were wrong.

**What is a regression test here?** Rerunning the eval suite after every change — wired into CI — so an improvement in one place doesn't silently break quality somewhere else.
