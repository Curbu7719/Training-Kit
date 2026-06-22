# Evaluating AI Features

When you test a normal feature, you assert: given this input, expect that output, and a green test proves it works. An **AI feature** breaks that contract — the same prompt can produce different wording every run, and there's rarely one "correct" string. A QA tester can't write `assertEquals` against a summary. Yet the team still needs to know whether the feature is good enough to ship, and whether a prompt change made it better or worse. **Evaluation** ("eval") is how you measure the quality of an AI feature systematically — it's what testing *becomes* when outputs are non-deterministic.

**Why it matters:** without measurement you're shipping on demos. A prompt tweak that looks great on three examples may quietly break a dozen others. Outputs also drift as you swap models, edit prompts, or change retrieval. Evaluation turns "it feels better" into evidence.

**Common approaches:**
- **Golden / offline datasets** — a curated set of inputs with known-good expected outputs or rubrics. The QA equivalent of a test suite: run the feature over them, score the results, rerun any time. Repeatable and cheap.
- **Human review** — people rate outputs for correctness, tone, or safety. The gold standard for nuance, but slow and expensive.
- **LLM-as-judge** — a second model scores outputs against a rubric (e.g., "is this answer faithful to the source?"). Fast and scalable, but the judge itself must be validated.
- **A/B tests** — release two variants and compare real user outcomes. Truest signal, but only available post-launch.

**Metrics you'll track:** **accuracy** (is it right?), **relevance** (does it address the request?), **faithfulness / groundedness** (does it stick to supplied sources?), **latency**, and **cost**. Quality, speed, and cost trade off.

**Regression testing** means rerunning the eval suite after every change so a fix in one place doesn't silently break another — wired into CI like any other test gate. This enables **eval-driven iteration**: change a prompt, run the suite, keep the change only if scores improve. It's TDD for AI: the numbers decide, not vibes.

## How each role uses this

- **Tester:** Builds the eval suite and golden dataset, scores properties instead of exact strings to tolerate non-determinism, and makes quality visible.
- **Developer:** Wires the eval suite into CI as a regression gate so a prompt change can't merge if scores drop.
- **Project Manager:** Defines what "good" means and sets the quality bar (pass threshold), weighing accuracy against latency and cost when deciding to ship.
- **Enterprise Architect:** Designs the observability so quality is visible in production, not just pre-launch.
