# Evaluating AI Systems

When you build a normal program, you test it: given this input, you expect that output, and a passing test proves it works. AI systems are harder, because the same prompt can produce different wording every time and there's rarely one "correct" string. Yet you still need to know whether the system is good enough to ship — and whether a change made it better or worse. **Evaluation** is how you measure the quality of an AI system systematically, instead of relying on a few impressive demos.

**Why it matters:** without measurement you're flying blind. A prompt tweak that looks great on three examples may quietly break a dozen others. AI outputs also drift as you swap models, edit prompts, or change retrieval. Evaluation turns "it feels better" into evidence.

**Common approaches:**
- **Golden / offline datasets** — a curated set of inputs with known-good expected outputs (or rubrics). You run the system over them and score the results. Repeatable and cheap to rerun.
- **Human review** — people rate outputs for quality, correctness, or tone. The gold standard for nuanced judgment, but slow and expensive.
- **LLM-as-judge** — a second model scores outputs against a rubric (e.g., "is this answer faithful to the source?"). Fast and scalable, but the judge itself must be validated.
- **A/B tests** — release two variants to real users and compare real outcomes. The truest signal, but slow and only available post-launch.

**Metrics you'll track:** **accuracy** (is it right?), **relevance** (does it address the question?), **faithfulness / groundedness** (does it stick to the supplied sources without inventing?), **latency** (how fast?), and **cost** (how much per call?). Quality, speed, and cost trade off against each other.

**Regression testing** means rerunning your eval suite after every change so a fix in one place doesn't silently break another. This enables **eval-driven iteration**: change a prompt, run the suite, keep the change only if the scores improve. It's the AI equivalent of test-driven development — you let the numbers, not vibes, decide.

## How each role uses this

- **Developer/Engineer:** Builds the eval harness and golden datasets, wires LLM-as-judge scoring, and runs the suite as a regression gate before every change ships.
- **Business Analyst:** Defines what "good" means for the use case — which metrics matter and the rubric for correctness — so evaluation reflects real business value.
- **PM/Product Owner:** Sets quality thresholds and weighs accuracy against latency and cost, and chooses when an A/B test is worth the slower signal.
- **QA & Architect:** Designs regression suites that tolerate non-determinism (scoring properties, not exact strings) and ensures evals run in CI so quality can't silently regress.
