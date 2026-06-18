# Prompt Engineering: Writing Instructions a Model Can Follow

A **prompt** is the text you give a language model to steer its output. Because the model only ever sees the words you send — it can't read your mind or your project context — the quality of those words largely decides the quality of the answer. Prompt engineering is the practice of writing prompts that are clear, structured, and testable so the model behaves the way you intend.

**An analogy:** think of briefing a brilliant new contractor who has zero context about your company. They do excellent work *if* you give them the goal, the constraints, the format you want back, and an example or two. Leave any of that out and they guess — sometimes well, often not. A good prompt is a good brief.

**Roles in a prompt.** Most systems separate a **system/developer message** from a **user message**. The system message sets durable rules and persona — "You are a support assistant; never reveal internal pricing." The user message carries the specific request — "Summarize this ticket." The system message has higher priority and persists across turns, so put policy and role there.

**Structure helps.** Models follow well-organized prompts more reliably:

- **Delimiters** — wrap input in markers (triple quotes, XML-style tags, headings) so the model can tell *your instructions* apart from *the data to process*.
- **Sections and ordering** — state the task first, then context, then data, then output format. Put the most important instruction where it won't get lost.
- **Be specific** — "Reply in 3 bullet points, under 15 words each" beats "be brief."

**Few-shot examples.** Showing one or more input→output examples ("few-shot") teaches the model the pattern far better than describing it. Zero-shot (no examples) is fine for simple tasks.

**Controlling output format.** Ask explicitly for JSON, a table, or a fixed template when downstream code or people consume the result.

**Iterating.** A first prompt is a draft. Test it on varied inputs, find where it fails, and refine — tighten wording, add an example, or reorder. Treat prompts as code you revise, not magic spells.

## How each role uses this

- **Developer/Engineer:** Writes the system message and output-format constraints so responses parse reliably, and version-controls prompts, iterating against failing cases like unit tests.
- **Business Analyst:** Encodes business rules and edge cases into clear, structured instructions, ensuring the prompt reflects the real requirement rather than a vague summary.
- **PM/Product Owner:** Defines the desired tone, scope, and output format up front, and recognizes that prompt quality, not just model choice, drives feature quality.
- **QA & Architect:** Builds a test set of representative inputs to validate prompts, and designs the prompt structure (system vs user split, delimiters) so it stays maintainable and safe.
