# Context Management at Depth: Trade-offs and Failure Modes

At L1 you learned the context window is a shared input+output token budget, that calls are stateless, and that summarization, chunking, retrieval, sliding window, and checkpointing keep an AI-assisted refactor or requirements session within it. At L2 the question is sharper: each strategy has a **cost**, and the wrong choice fails in characteristic ways during real SDLC work.

**Summarization** trades fidelity for space. A good summary of a design discussion preserves decisions, identifiers, and constraints; a careless one drops the detail a later edit needs. Failure mode: **lossy compression** — the model proceeds on a summary that silently omitted a key acceptance criterion. It compounds: summaries of summaries drift further from the source each round.

**Sliding window** is cheap and simple but **amnesiac by design** — anything older than the window is gone. Failure mode: the model "forgets" a constraint stated early in a refactor (keep a column name, a naming convention) because it scrolled out. Pair it with a running summary or pinned facts.

**Retrieval (RAG)** keeps the window lean by fetching only relevant files or doc chunks, but introduces a **retrieval-quality dependency**: if the retriever returns the wrong files, the model answers from nothing — or hallucinates an API. Failure modes: poor chunking that splits a function or rule across boundaries, embedding mismatch, and **stale indexes** serving an outdated version of the code. Retrieval moves the hard problem from "fit the window" to "retrieve the right thing."

**Checkpointing / handoff** preserves long-running work — a multi-day migration — as a structured state summary so a new session or teammate can resume. Failure mode: an incomplete checkpoint omits an in-flight decision, and the resuming session repeats or contradicts prior work.

**Cross-cutting edge cases:**

- **Position effects** — models attend less reliably to material buried in the middle of a very long context ("lost in the middle"). A bigger window is not a free pass; place the critical spec near the edges.
- **Budget contention** — a near-full input (30 pasted files) starves the output; reserve headroom for the generated code.
- **Cost and latency scale with tokens** — the largest window is rarely the cheapest answer for CI-frequency calls.
- **Combining strategies** is normal: sliding window for recent dialogue + summary for older history + retrieval for the codebase.

The skill is matching strategy to content and accepting its failure mode knowingly, rather than assuming any single technique is "safe."

## How each role uses this

- **Developer:** Selects and *combines* strategies for a refactor, reserves output headroom, instruments token usage, and orders critical files deliberately to dodge lost-in-the-middle.
- **Project Manager:** Weighs the cost/latency of large windows vs retrieval, flags which constraints are non-negotiable so they're never summarized away, and accepts each strategy's residual failure mode when prioritizing.
- **Tester:** Designs adversarial cases — early constraints that must survive a long session, retrieval with stale/missing files, mid-context facts.
- **Enterprise Architect:** Picks an architecture whose failure mode is tolerable for the use case and defines what "correct retrieval" means for the domain.
