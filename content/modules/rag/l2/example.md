# Worked Example: When the Codebase Assistant Is Wrong, Fix Retrieval First

Your RAG assistant gives a confidently wrong answer about the `billing` service. Your instinct is to blame the model — but almost every RAG failure is a **retrieval** failure, not a generation one. If the right file never reached the prompt, no model could have saved it. Here's how tuning retrieval makes the assistant trustworthy enough to rely on.

**Chunk on structure, not size.** Fixed-size chunks cut across a function; splitting on function/class/heading boundaries keeps each chunk whole, with 10–20% overlap so a signature isn't lost at a seam. *Why does this make your day easier?* The assistant stops returning half a function — you get an answer that actually compiles in your head.

**Retrieve smarter than top-k cosine.** You add **hybrid search** so an exact token like a function name or error code isn't lost in pure-meaning matching, **re-ranking** to reorder a generous candidate set, and a **metadata filter** so a question about `billing` doesn't pull `payments` code. *Why use AI here at all?* Because now it answers about the *right* service — the filter is what stops near-identical code from misleading you.

**Force grounding.** You instruct the model to answer *only* from the provided context and say "not found" when it's insufficient. *Why?* Otherwise it falls back on training memory and invents an API — the "not found" is more useful than a confident fabrication.

**Know the failure modes.** Wrong-service look-alikes, "lost in the middle" (models attend less to buried passages), **stale indexes** serving a signature a refactor already changed, and chunk-boundary loss. *Why does this save you?* When an answer is wrong you can tell *which* link broke — bad retrieval or bad generation — and fix that one.

**The takeaway:** a wrong RAG answer is usually a retrieval bug wearing a generation costume. Chunk on structure, retrieve with hybrid + re-rank + filters, enforce grounding, and re-index after refactors — and the assistant earns the trust to answer about your code unsupervised.
