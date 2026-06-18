# Hints & Alternative Phrasings

## Alternative phrasings

- A prompt is a **brief for a brilliant but context-free contractor**: state the goal, the rules, the format, and show an example.
- Prompt engineering means writing instructions that are **clear, structured, and testable** — treat the prompt like code you revise, not a magic spell.
- The **system message** is durable policy and persona; the **user message** is the specific request. Put rules in the system message so they persist and take priority.

## Hint stack

**H1 (nudge):** What does the model actually receive? Only the text you send — no hidden context. So anything it needs to know must be *in* the prompt.

**H2 (structure):** A reliable prompt usually has these parts: a role/policy (system), the task stated plainly, any context and data wrapped in **delimiters**, the **output format** you want, and optionally one or two **examples**. Order them so the most important instruction stands out.

**H3 (worked):** To classify text reliably, your prompt should (1) set the role in a system message, (2) list the exact allowed labels, (3) wrap the input in tags like `<message>...</message>`, (4) demand a fixed output ("one word, no explanation"), and (5) show 1-2 few-shot examples covering tricky cases. Then test on varied inputs and tighten where it fails.

## FAQ

**Q: Few-shot vs zero-shot — when do I need examples?**
Zero-shot (just instructions, no examples) is fine for simple, unambiguous tasks. Add few-shot examples when the task has a specific format, tricky edge cases, or a tone you can show more easily than describe.

**Q: Why use delimiters like tags or triple quotes?**
They separate *your instructions* from *the data the model should process*. Without them, content in the data (e.g., a user message that says "ignore the above") can be mistaken for an instruction.

**Q: System message or user message — where do rules go?**
Durable rules, persona, and safety policy go in the **system/developer message**: it has higher priority and persists across turns. The **user message** holds the specific, changing request.

**Q: My prompt works sometimes but not always. What now?**
Iterate. Collect the inputs where it fails, then tighten wording, add a clarifying instruction, add an example covering that case, or reorder so the key rule isn't buried. Re-test against all your sample inputs.
