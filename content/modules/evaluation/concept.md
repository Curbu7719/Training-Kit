# Evaluating AI Features

When you test a normal feature, you check one thing: for this input, you expect that output. A green test proves it works. An **AI feature** breaks this rule. The same prompt can give different words every time you run it. There is rarely one "correct" answer. So a QA tester cannot write `assertEquals` against a summary. But the team still needs to know two things: is the feature good enough to ship, and did a prompt change make it better or worse? **Evaluation** ("eval") is how you measure the quality of an AI feature in a careful, repeatable way. (An eval is a test built for AI: it scores quality instead of checking for one exact answer.) It is what testing turns into when outputs are not the same every time.

**Why it matters:** without measurement, you are shipping based on demos. A small prompt change can look great on three examples but quietly break a dozen others. Outputs also drift when you swap models, edit prompts, or change retrieval. Evaluation turns "it feels better" into real evidence.

**Common approaches:**
- **Golden / offline datasets** — a hand-picked set of inputs with known good answers, or rules for grading. (A golden dataset is your saved set of test cases with the answers you trust.) This is the QA version of a test suite: run the feature over them, score the results, and run again any time. Repeatable and cheap.
- **Human review** — people rate outputs for correctness, tone, or safety. The best way to judge subtle things, but slow and expensive.
- **LLM-as-judge** — a second model scores outputs against a set of rules (for example, "is this answer true to the source?"). (LLM-as-judge means you use one AI to grade the answers of another AI.) Fast and easy to scale, but you must first check that the judge is reliable.
- **A/B tests** — release two versions and compare what real users do. The truest signal, but you only get it after launch.

**Metrics you will track:** **accuracy** (is it right?), **relevance** (does it answer the request?), **faithfulness / groundedness** (does it stick to the sources you gave it?), **latency** (how long it takes to answer), and **cost**. Quality, speed, and cost trade off against each other.

**Regression testing** means running the eval suite again after every change, so that fixing one thing does not quietly break another. (A regression is when something that used to work breaks.) You wire it into CI like any other test gate. This enables **eval-driven iteration**: change a prompt, run the suite, and keep the change only if the scores go up. It is TDD for AI: the numbers decide, not gut feeling.

## How each role uses this

- **Tester:** Builds the eval suite and golden dataset. Scores general qualities instead of exact words, so different wording is fine. Makes quality easy to see.
- **Developer:** Wires the eval suite into CI as a regression gate, so a prompt change cannot merge if the scores drop.
- **Project Manager:** Defines what "good" means and sets the quality bar (the pass mark). Weighs accuracy against latency and cost when deciding to ship.
- **Enterprise Architect:** Designs the monitoring so quality is visible in production, not just before launch.
