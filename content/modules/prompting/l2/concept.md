# Advanced Prompting Patterns

L1 covered the fundamentals: a clear brief, the system/user split, delimiters, and iterating. L2
is the toolkit for **production** prompts — the patterns that make output reliable enough for other
software and teammates to depend on, and the discipline that keeps a prompt working as it evolves.

**A running example.** Your team ships an **AI feature that turns a spec into a structured test
plan**, consumed by downstream tooling. A casual prompt works in a demo and breaks in production;
these patterns are what make it dependable.

## Few-shot done well

Showing examples ("few-shot") teaches house style better than describing it — but only if the
examples are good:

- **Representative and diverse** — cover the easy case *and* the awkward ones (empty input, an
  edge case), not three near-identical happy paths.
- **Consistent with the format you want** — the examples *are* the spec; any inconsistency teaches
  the model to be inconsistent.
- **Ordered deliberately** — put the clearest example first; too many examples waste tokens for
  little gain, so add them where zero-shot actually fails.

## Reasoning prompts

For multi-step problems, let the model work through it: ask it to reason step by step, or use a
**reasoning model** that does this internally. This helps on hard logic, debugging, and trade-off
analysis. For simple tasks it just adds tokens and latency — and when you only need the final
answer for downstream code, have it reason then return **only** the structured result.

## Structured output as a contract

When tooling or a teammate consumes the result, free text is a liability. Specify a **strict
output contract**: a named JSON schema (or a fixed template), wrapped in delimiters, with the model
told to return *only* that. Then **validate** the output before use and repair or reject on
failure. A defined schema plus validation is what lets downstream code rely on the result instead
of regexing prose.

## Prompts as versioned artifacts

A production prompt is code. Keep it in **version control or a prompt registry**, not inline and
edited live; **parameterize** the variable parts (the spec, the framework) instead of rewriting the
whole string; and review changes like any other change. This is what makes a prompt maintainable
across a team.

## Eval-driven iteration

Don't tune prompts by vibes. Keep a small **eval set** of representative inputs with known-good
outputs; change the prompt, run the set, and keep the change **only if scores improve**. This is
TDD for prompts and ties directly to the Evaluation module — it's how a fix for one case avoids
silently breaking ten others.

## Robustness

Real inputs are messy and sometimes hostile. Handle ambiguity (tell the model what to do when
information is missing rather than letting it guess), and treat any **untrusted text** in the
prompt (a pasted ticket, a fetched document) as data, not instructions — the prompt-injection
boundary covered in Guardrails.

## How each role uses this

- **Developer:** Writes the JSON-schema output contract with validation, parameterises and version-controls the prompt, and iterates it against an eval set in CI.
- **Tester:** Builds the eval/regression set and tests output against the schema and for prompt-injection robustness.
- **Designer:** Supplies representative and edge-case examples and defines what a "good" output contains, so few-shot and the eval set reflect real needs.
- **Project Manager:** Treats the prompt as a maintained asset (versioned, reviewed) and sets the quality bar the eval set must clear before a change ships.
- **Enterprise Architect:** Designs the prompt-versioning and validation seams so prompts stay dependable as they evolve.
