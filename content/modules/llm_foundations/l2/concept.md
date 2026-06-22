# Choosing and Controlling Models

L1 explained what an LLM is — a program that predicts the next token. L2 is the working knowledge
to pick the *right* model for each job, and to control how it writes its answer. In an AI-driven
SDLC you don't use "the AI". You use a **fleet of models** with different strengths, speeds,
prices, and settings. Matching them to tasks is an engineering decision.

**A running example.** Your dev toolchain calls models in several places: inline code-completion
in the IDE, an automated PR reviewer, a chat assistant over your docs, and an occasional "think
hard about this design" helper. Treating all four as the same model is how you end up slow,
expensive, and inconsistent.

## Model types — not just sizes

- **Base vs instruction-tuned.** A base model only continues text. An instruction-tuned ("chat")
  model is trained to follow instructions — that is what you almost always want.
- **Reasoning models.** Some models spend extra computing time "thinking" before they answer. They
  are stronger on hard, multi-step problems (tricky bugs, design trade-offs) but slower and pricier
  — too much for autocomplete.
- **Small vs large.** Small/fast/cheap handles routine, well-defined tasks. Large/capable/slower is
  worth its cost only on truly hard work.
- **Open vs proprietary, and multimodal.** Open-weight models can run in your own environment (so
  you control where the data lives). Multimodal models can also take images (a screenshot, a
  diagram) as input.

## Output controls — shaping the response

Beyond the model itself, a couple of settings shape what comes back:

- **Max output tokens** — caps the length and the cost. Set it on purpose, not by default.
- **Stop sequences** — tell the model where to stop (for example, the end of a code block).

## Non-determinism is the default

The same input is not guaranteed to give the same output each run. Write the code and tests that
use the result to **allow for variation** — score properties, not exact strings — and ask for a
strict format when a tool must read the result. This connects directly to the Evaluation module.

## Matching model to task — and routing

Pick the **smallest model that reliably does the task**, then **route** the work: send a cheap
model down the high-volume routine path, and send only hard or low-confidence cases up to a stronger
one. Across a whole toolchain this is the single biggest lever on cost and latency.

## Limits don't disappear at larger sizes

A bigger model hallucinates less, but it still invents facts with confidence, still has a knowledge
cutoff, and still costs more and runs slower. "Use the biggest model" is not a strategy; matching
capability to need is.

## How each role uses this

- **Developer:** Sets the max output length and stop sequences per task, picks a small model for completion and a reasoning model for hard debugging, and wires up the routing.
- **Enterprise Architect:** Designs the routing and the provider layer so models stay swappable, and checks model choice against an eval set.
- **Tester:** Tests under non-determinism, and checks that the chosen model keeps its quality on a representative set of inputs.
- **Project Manager:** Weighs capability vs cost vs latency per feature, and budgets for routing instead of one expensive model everywhere.
