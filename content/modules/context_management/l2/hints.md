# Hints & Alternative Phrasings (L2)

## Alternative phrasings of the core idea

- **One sentence:** Every context strategy buys space at a price — summarization loses fidelity, sliding window forgets, retrieval depends on retrieval quality, checkpointing depends on capturing the right state — so you choose by which failure mode you can tolerate.
- **Another angle:** There is no "safe" single technique. Robust systems combine strategies and explicitly protect the facts that must never be dropped.
- **Risk framing:** Picking a strategy is picking a failure mode. Make that choice deliberately, then test for exactly that failure.

## Progressive hint stack

- **H1:** For each strategy, ask "what does this silently lose?" Summarization loses detail; sliding window loses old turns; retrieval can fetch the wrong/no chunk; checkpoints can omit in-flight state.
- **H2:** Match the failure mode to the symptom. A constraint stated early that gets violated late → it scrolled out (sliding window) or was compressed away (summarization). An answer pulled from thin air → retrieval missed or chunking split it. A resumed session repeating work → an incomplete checkpoint.
- **H3:** The strongest answers usually *combine* strategies and *pin* non-negotiable facts so they're never summarized or dropped. Also remember position effects (lost-in-the-middle) and reserving output headroom — a bigger window alone is not the fix.

## FAQ

**Q: Isn't a much larger context window a simpler fix than all this?**
A: It helps but isn't a cure. Larger windows cost more and add latency, models can attend less reliably to mid-context material, and you still must reserve room for output. Strategy still matters.

**Q: Why do summaries get worse over a long session?**
A: Summarizing a prior summary compounds loss — each round drifts further from the source. Protect critical facts by pinning them verbatim instead of letting them be re-summarized.

**Q: My retrieval-based assistant sometimes answers confidently but wrong. Why?**
A: Likely a retrieval miss — wrong, partial, or stale chunks. The model then fills the gap by hallucinating. Improve chunk boundaries, refresh the index, and verify retrieved chunks actually cover the question.
