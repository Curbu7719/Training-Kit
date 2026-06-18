# Prompt Engineering: Writing Instructions a Model Can Follow

A **prompt** is the text you give a language model to steer its output. Because the model only ever sees the words you send — it can't read your repository, your ticket tracker, or your intent — the quality of those words largely decides the quality of the answer. Prompt engineering is the practice of writing prompts that are clear, structured, and testable so the model behaves the way you intend across the software lifecycle.

**An analogy:** think of briefing a brilliant new contractor who just joined the team. They write excellent code, draft sharp user stories, and find edge cases *if* you give them the goal, the constraints, the format you want back, and an example or two. Leave any of that out and they guess — sometimes well, often not. A good prompt is a good brief.

**Roles in a prompt.** Most systems separate a **system/developer message** from a **user message**. The system message sets durable rules and persona — "You are a senior engineer who writes tests with the project's framework and never invents APIs." The user message carries the specific request — "Generate unit tests for this function." The system message has higher priority and persists across turns, so put policy, coding standards, and role there.

**Structure helps.** Models follow well-organized prompts more reliably:

- **Delimiters** — wrap the code, story, or spec in markers (triple backticks, XML-style tags) so the model separates *your instructions* from *the artifact to process*.
- **Sections and ordering** — state the role, then the context/code, then the task, then any examples, then the output format. Put the most important instruction where it won't get lost.
- **Be specific** — "Cover the empty-list, single-item, and overflow cases; use pytest" beats "write some tests."

**Few-shot examples.** Showing one or more input→output examples ("few-shot") teaches the model your house style — your test naming, your story format — far better than describing it. Zero-shot is fine for simple, unambiguous tasks.

**Controlling output format.** Ask explicitly for a unified diff, a single test file, Gherkin scenarios, or JSON when downstream tooling or teammates consume the result.

**Iterating.** A first prompt is a draft. Run it on varied inputs, find where it fails, and refine — like revising code against failing tests, not casting magic spells.

## How each role uses this

- **Developer/Engineer:** Writes a system message pinning the test framework and coding standards, then prompts the model to generate unit tests or a refactor as a diff, iterating against cases the model first gets wrong.
- **Business Analyst:** Structures a prompt that turns a stakeholder request into a user story with explicit acceptance criteria, encoding the real business rule rather than a vague paraphrase.
- **PM/Product Owner:** Defines the desired scope, tone, and output format (e.g., a prioritized backlog table) up front, recognizing that prompt quality — not just model choice — drives feature quality.
- **QA/Tester & Architect:** Builds a prompt that drafts a test plan from a spec with a fixed section template, and designs the system/user split and delimiters so prompts stay reusable and safe across the team.
