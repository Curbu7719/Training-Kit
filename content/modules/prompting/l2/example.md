# Worked Example: Hardening a Spec-to-Test-Plan Prompt

Your AI feature turns a feature spec into a structured test plan that downstream tooling ingests.
The first prompt demoed well and then broke in production. Here's how the advanced patterns make it
dependable.

## The casual prompt (and how it failed)

> "Read this spec and write a test plan."

In the demo it produced a tidy plan. In production it returned prose one time, a markdown table the
next, skipped edge cases, and once invented a requirement that wasn't in the spec. Downstream
parsing broke on the second run. The problem isn't the model — it's an unspecified prompt.

## Fix 1 — A strict output contract

You define a JSON schema: an array of test cases, each with `id`, `title`, `type`
(happy/edge/negative), and `steps`. The prompt wraps the spec in delimiters and says **return only
JSON matching this schema**. Downstream code then **validates** every response against the schema
and rejects or repairs on failure — so a malformed run can't silently corrupt the pipeline.

## Fix 2 — Few-shot with real diversity

You add two examples: one ordinary feature *and* one with a tricky edge case (empty input, a
permission boundary). Now the model reliably emits negative and edge cases, not just the happy
path — because the examples, not the prose, taught it what "complete" means.

## Fix 3 — Handle the missing-info case

Specs are often incomplete. Instead of letting the model invent requirements, the prompt instructs:
*if the spec doesn't state a behaviour, add a test case flagged `assumption` rather than inventing a
rule.* Ambiguity now surfaces as a visible flag instead of a confident fabrication.

## Fix 4 — Version it and gate it with evals

You move the prompt out of the code and into version control, parameterizing the spec input. You
keep a small **eval set**: ten specs with known-good plans. Every prompt change runs the set in CI
and ships **only if scores hold or improve** — so tightening one case can't quietly break others.

## The lesson

The model didn't get smarter; the prompt got **engineered**. A schema-bound output contract with
validation, diverse few-shot examples, explicit handling of missing info, and a versioned
prompt gated by an eval set turn a demo-grade prompt into one production tooling can depend on.
That's the difference between prompting that impresses and prompting that ships.
