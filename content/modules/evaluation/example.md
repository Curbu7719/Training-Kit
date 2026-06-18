# Worked Example: QA Tests an AI Release-Notes Generator

**SDLC phase: Testing.** A team ships a feature that turns a list of merged pull requests into a one-paragraph release note. It demos beautifully — but "demos beautifully" isn't a test result. The QA tester owns making it *measurable* before launch and guarding it against regressions.

**Step 1 — Build a golden dataset.** QA collects 100 real PR-list inputs and, for each, writes a known-good reference note plus a short rubric: the note must be accurate, must mention every user-facing change, and must invent nothing not in the PRs. This dataset becomes the repeatable yardstick — the AI feature's test suite.

**Step 2 — Score with an LLM-as-judge.** Hand-grading 100 notes every run is too slow for CI. So QA uses a second model as judge, prompted with the rubric: "Given the PR list, the reference note, and the candidate note, rate the candidate 1–5 on accuracy and completeness, and flag any claim not supported by the PRs." The faithfulness flag catches notes that invent features — a groundedness check.

**Step 3 — Read the metrics.** First run: accuracy 4.1/5, completeness 4.3/5, faithfulness flags on 12% of outputs, average latency 1.8s, cost \$0.002 per note. The 12% is the red flag — one in eight notes claims a change that wasn't in the PRs.

**Step 4 — Iterate against the eval.** A developer edits the prompt: "use only changes present in the PR list." They rerun the same 100-item suite. Faithfulness flags drop to 3%; accuracy and completeness hold. Because the score improved with no regression, they keep the change.

**Step 5 — Lock it in as a regression gate.** The eval suite now runs in CI before every release. Later someone swaps in a cheaper model to cut cost; the suite shows faithfulness creeping back to 9%, so QA catches the regression before users see it.

**The takeaway:** a golden dataset plus automated scoring turned a subjective "feels good" into objective, repeatable numbers — and made every future change provably safe or unsafe to ship.
