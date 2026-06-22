# Context Management at Depth: Trade-offs and Failure Modes

At L1 you learned that the context window is a shared input+output token budget, that calls are stateless, and that summarization, chunking, retrieval, sliding window, and checkpointing keep an AI-assisted refactor or requirements session inside it. At L2 the question is sharper: each strategy has a **cost**, and the wrong choice fails in its own typical way during real SDLC work.

**Summarization** trades detail for space. A good summary of a design discussion keeps the decisions, names, and constraints. A careless one drops the detail a later edit needs. Failure mode: **lossy compression** — the model goes on from a summary that quietly left out a key acceptance criterion. It builds up over time: summaries of summaries drift further from the source each round.

**Sliding window** is cheap and simple but **forgetful by design** — anything older than the window is gone. Failure mode: the model "forgets" a constraint stated early in a refactor (keep a column name, a naming rule) because it scrolled out of the window. Pair it with a running summary or pinned facts.

**Retrieval (RAG)** keeps the window lean by fetching only relevant files or doc chunks. But it adds a **dependency on retrieval quality**: if the retriever returns the wrong files, the model answers from nothing — or hallucinates an API. Failure modes: poor chunking that splits a function or rule across boundaries; embedding mismatch (an *embedding* is a numeric representation of meaning used to find related text); and **stale indexes** that serve an out-of-date version of the code. Retrieval moves the hard problem from "fit the window" to "fetch the right thing."

**Checkpointing / handoff** saves long-running work — a multi-day migration — as a structured state summary, so a new session or teammate can pick it up. Failure mode: an incomplete checkpoint leaves out an in-flight decision, and the resuming session repeats or goes against earlier work.

**Cross-cutting edge cases:**

- **Position effects** — models pay less reliable attention to material buried in the middle of a very long context ("lost in the middle"). A bigger window is not a free pass; place the critical spec near the edges.
- **Budget contention** — a nearly full input (30 pasted files) starves the output; keep headroom for the generated code.
- **Cost and latency grow with tokens** — the largest window is rarely the cheapest answer for CI-frequency calls.
- **Combining strategies** is normal: sliding window for recent dialogue + summary for older history + retrieval for the codebase.

The skill is matching the strategy to the content and accepting its failure mode knowingly, rather than assuming any single technique is "safe."

## How each role uses this

- **Developer:** Selects and *combines* strategies for a refactor, keeps output headroom, measures token usage, and orders critical files on purpose to dodge lost-in-the-middle.
- **Project Manager:** Weighs the cost/latency of large windows vs retrieval, flags which constraints are non-negotiable so they are never summarized away, and accepts each strategy's leftover failure mode when setting priorities.
- **Tester:** Designs adversarial cases — early constraints that must survive a long session, retrieval with stale/missing files, mid-context facts.
- **Enterprise Architect:** Picks an architecture whose failure mode is acceptable for the use case, and defines what "correct retrieval" means for the domain.
