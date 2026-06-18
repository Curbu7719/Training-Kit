# Hints & Alternative Phrasings

## Alternative phrasings of the core idea

- **One sentence:** An LLM is a next-token predictor — it repeatedly guesses the most plausible next chunk of text, and that single mechanism powers everything from autocompleting code to reviewing a design.
- **Another angle:** Training bakes patterns into frozen weights once; inference uses those frozen weights every time your IDE, CI job, or chat tool calls the model. You only ever interact with inference.
- **Trade-off framing:** Choosing a model for an SDLC task is balancing three dials — capability, cost, and latency. The skill is using the *smallest* model that still does the job (commit messages, PR titles) and reserving the biggest for hard work (design review, complex refactors).

## Progressive hint stack

- **H1:** Don't think of the model as "knowing answers." Think of it as continuing text. Ask: what is the most likely thing to come next after this prompt — this diff, this requirement, this test stub?
- **H2:** Match the trait to its real-world consequence. If a trait is about *what the model can't be sure of* (a new framework version, factual truth), the implication is about *risk and verification*. If a trait is about *how output varies*, the implication is about *repeatability and temperature*.
- **H3:** For model-choice questions, map each SDLC requirement to a dial: "cheap at high volume" (commit messages) → smaller model; "identical every run" (structured output) → low temperature; "hard multi-step reasoning" (architecture review, gnarly refactor) → larger model. Pick the lightest option that satisfies the requirement.

## FAQ

**Q: Does a higher temperature make the model better at code review?**
A: No. Temperature only controls how varied vs focused the sampling is. Low temperature is more repeatable; high is more diverse. Neither adds knowledge or reasoning capability — for hard review, choose a more capable model, not a hotter one.

**Q: If training already happened, why does the model recommend an outdated API?**
A: Because of the knowledge cutoff. The frozen weights only reflect data up to the training date. To use a newer framework version, supply that information (docs, version) in the prompt — the model won't have it on its own.

**Q: Why might the same prompt give my CI job two different commit messages?**
A: LLMs are non-deterministic by default; sampling introduces variation. Lowering temperature reduces it, but for truly stable behavior also design steps and tests that don't depend on an exact-string match.
