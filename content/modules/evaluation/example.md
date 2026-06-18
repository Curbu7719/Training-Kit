# Worked Example: Evaluating a Summarization Feature

A team has built a feature that summarizes long customer reviews into one sentence. It looks great in demos — but "looks great" isn't shippable. They need to *measure* it before launch and guard it against future regressions.

**Step 1 — Build a golden dataset.** They collect 100 real reviews and, for each, write a known-good reference summary plus a short rubric: the summary must be accurate, must capture the main complaint or praise, and must be one sentence. This dataset becomes the repeatable yardstick.

**Step 2 — Score with an LLM-as-judge.** Scoring 100 summaries by hand every time is too slow. So they use a second model as a judge, prompted with the rubric: "Given the review, the reference summary, and the candidate summary, rate the candidate 1–5 on accuracy and relevance, and flag any claim not supported by the review." The faithfulness flag catches summaries that invent details — a groundedness check.

**Step 3 — Read the metrics.** The first run scores: accuracy 4.1/5, relevance 4.3/5, faithfulness flags on 12% of outputs, average latency 1.8s, cost \$0.002 per summary. The 12% faithfulness rate is the red flag — one in eight summaries adds something the review never said.

**Step 4 — Iterate against the eval.** An engineer edits the prompt to add "use only information present in the review." They rerun the same 100-item suite. Faithfulness flags drop to 3%; accuracy and relevance hold steady. Because the score improved with no regression elsewhere, they keep the change.

**Step 5 — Lock it in as a regression test.** The eval suite now runs automatically before every release. Later, someone swaps in a cheaper model to cut cost; the suite shows faithfulness creeping back to 9%, so they catch the regression before users ever see it.

**The takeaway:** a golden dataset plus automated scoring turned a subjective "feels good" into objective, repeatable numbers — and made every future change provably safe or unsafe to ship.
