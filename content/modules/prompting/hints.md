# Hints & Alternative Phrasings

## Alternative phrasings

- A prompt is a **brief for a brilliant new teammate**: state the goal, the coding standards or business rule, the output format, and show an example artifact.
- Prompt engineering means writing instructions that are **clear, structured, and testable** — treat the prompt like code you revise against failing cases, not a magic spell.
- The **system message** holds durable policy (framework, standards, persona); the **user message** holds the specific request (this function, this story). Put rules in the system message so they persist and take priority.

## Hint stack

**H1 (nudge):** What does the model actually receive? Only the text you send — not your repo, your ticket, or your test framework. So anything it needs (the code, the rules, the format) must be *in* the prompt.

**H2 (structure):** A reliable prompt for a dev-lifecycle task usually has these parts, in order: a **role/policy** (system message — framework, standards), the **context or code** wrapped in **delimiters**, the **task** stated plainly, optionally one or two **few-shot examples** in your house style, and the **output format** you want back. Put the most important instruction where it won't get buried.

**H3 (worked):** To generate unit tests for a function: (1) set the role and test framework in a system message, (2) paste the real code in tags like `<code>...</code>`, (3) name the exact cases to cover (empty, negative, non-numeric), (4) demand a fixed output ("one test file, no prose"), and (5) show one existing test as a style example. Then run the tests and tighten the prompt where they fail.

## FAQ

**Q: Few-shot vs zero-shot — when do I need examples?**
Zero-shot (instructions only) is fine for simple, unambiguous tasks like "summarize this PR description." Add few-shot examples when the artifact has a specific format or house style — your test naming, your user-story template, your commit-message convention — that's easier to show than describe.

**Q: Why wrap code or a spec in delimiters?**
They separate *your instructions* from *the artifact the model should work on*. Without them, a comment in the pasted code (e.g., "TODO: ignore validation") or text in a spec can be mistaken for an instruction to the model.

**Q: System message or user message — where do rules go?**
Durable rules go in the **system/developer message**: the test framework, coding standards, persona, and safety policy. It has higher priority and persists across turns. The **user message** holds the specific, changing request — this function, this story, this refactor.

**Q: My prompt generates good tests sometimes but not always. What now?**
Iterate like you would on code. Collect the inputs where the output is wrong, then tighten wording, name the missing edge case, add an example covering it, or reorder so the key rule isn't buried — and re-run against all your sample inputs.
