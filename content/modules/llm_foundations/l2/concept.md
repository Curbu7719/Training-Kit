# Choosing and Controlling Models

L1 explained what an LLM is — a next-token predictor. L2 is the working knowledge to pick the
*right* model for each job and to control how it generates. In an AI-driven SDLC you don't use
"the AI"; you use a **fleet of models** with different strengths, speeds, prices, and settings,
and matching them to tasks is an engineering decision.

**A running example.** Your dev toolchain calls models in several places: inline code-completion
in the IDE, an automated PR reviewer, a chat assistant over your docs, and an occasional "reason
hard about this design" helper. Treating all four as the same model is how you end up slow,
expensive, and inconsistent.

## Model types — not just sizes

- **Base vs instruction-tuned.** A base model only continues text; an instruction-tuned ("chat")
  model is trained to follow instructions — that's what you almost always want.
- **Reasoning models.** Some models spend extra computation "thinking" before answering. They're
  stronger on hard, multi-step problems (tricky bugs, design trade-offs) but slower and pricier —
  overkill for autocomplete.
- **Small vs large.** Small/fast/cheap handles routine, well-scoped tasks; large/capable/slower
  earns its cost only on genuinely hard work.
- **Open vs proprietary, and multimodal.** Open-weight models can run in your own environment
  (data-residency control); multimodal models also accept images (a screenshot, a diagram) as input.

## Output controls — shaping the response

Beyond the model itself, a couple of settings shape what comes back:

- **Max output tokens** — caps length and cost; set it deliberately, not by default.
- **Stop sequences** — tell the model where to stop (e.g. the end of a code block).

## Non-determinism is the default

The same input isn't guaranteed to produce identical output run to run. Design downstream code and
tests to **tolerate variation** — score properties, not exact strings, and ask for a strict format
when a tool must parse the result. This connects directly to the Evaluation module.

## Matching model to task — and routing

Pick the **smallest model that reliably does the task**, then **route**: a cheap model on the
high-volume routine path, escalating only hard or low-confidence cases to a stronger one. Across a
whole toolchain this is the single biggest lever on cost and latency.

## Limits don't disappear at larger sizes

A bigger model hallucinates less but still confidently invents facts, still has a knowledge
cutoff, and still costs more and runs slower. "Use the biggest model" is not a strategy; matching
capability to need is.

## How each role uses this

- **Developer/Engineer:** Sets max output length and stop sequences per task, picks a small model
  for completion and a reasoning model for hard debugging, and wires the routing.
- **Business Analyst:** Knows which tasks tolerate varied output (brainstorming) vs need a strict,
  repeatable format (extraction), and shapes requirements accordingly.
- **PM/Product Owner:** Weighs capability vs cost vs latency per feature and budgets for routing
  instead of one expensive model everywhere.
- **QA/Tester & Architect:** Tests under non-determinism, validates model choice against an eval
  set, and designs the routing and provider abstraction so models stay swappable.
