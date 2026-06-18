# Hints & Alternative Phrasings

## Alternative phrasings of the core idea

- **One sentence:** An LLM is a next-token predictor — it repeatedly guesses the most plausible next chunk of text, and that single mechanism powers everything it appears to "do."
- **Another angle:** Training bakes patterns into frozen weights once; inference uses those frozen weights to answer your prompt every time. You only ever interact with inference.
- **Trade-off framing:** Choosing a model is balancing three dials — capability, cost, and latency. The skill is using the *smallest* model that still does the job, not the biggest available.

## Progressive hint stack

- **H1:** Don't think of the model as "knowing answers." Think of it as continuing text. Ask: what is the most likely thing to come next after this prompt?
- **H2:** Match the trait to its real-world consequence. If a trait is about *what the model can't be sure of* (recent events, factual truth), the implication is about *risk and verification*. If a trait is about *how output varies*, the implication is about *repeatability and temperature*.
- **H3:** For model-choice questions, map each requirement to a dial: "must be cheap at scale" → smaller model; "must be identical every run" → low temperature; "needs hard multi-step reasoning" → larger/more capable model. Pick the lightest option that satisfies the requirement.

## FAQ

**Q: Does a higher temperature make the model smarter?**
A: No. Temperature only controls how varied vs focused the sampling is. Low temperature is more repeatable; high is more creative/diverse. Neither adds knowledge or capability.

**Q: If training already happened, why does the model still get current events wrong?**
A: Because of the knowledge cutoff. The frozen weights only reflect data up to the training date. To answer about newer events, you must supply that information in the prompt — the model won't have it on its own.

**Q: Why might the same prompt give me two different answers?**
A: LLMs are non-deterministic by default; sampling introduces variation. Lowering temperature reduces it, but for truly identical output you should also design tests and features that don't depend on an exact-string match.
