# Context Management at Depth: Trade-offs and Failure Modes

At L1 you learned the context window is a shared input+output token budget, that calls are stateless, and that summarization, chunking, retrieval, sliding window, and checkpointing keep you within it. At L2 the question is sharper: each strategy has a **cost**, and the wrong choice fails in characteristic ways.

**Summarization** trades fidelity for space. A good summary preserves decisions, identifiers, and constraints; a careless one drops the detail a later turn needs. Failure mode: **lossy compression** — the model proceeds on a summary that silently omitted a key fact. It also compounds: summaries of summaries drift further from the source each round.

**Sliding window** is cheap and simple but **amnesiac by design** — anything older than the window is gone unless captured elsewhere. Failure mode: the model "forgets" a constraint stated early (a name, a rule, a prior decision) because it scrolled out. Pair it with a running summary or pinned facts to mitigate.

**Retrieval (RAG)** keeps the window lean by fetching only relevant chunks, but introduces a **retrieval-quality dependency**: if the retriever returns the wrong or no chunks, the model answers from nothing — or hallucinates. Failure modes: poor chunking that splits an answer across boundaries, embedding mismatch, and **stale indexes** serving outdated content. Retrieval moves the hard problem from "fit the window" to "retrieve the right thing."

**Checkpointing / handoff** preserves long-running work as a structured state summary so a new session (or agent) can resume. Failure mode: an incomplete checkpoint — the handoff omits an in-flight decision, and the resuming session repeats or contradicts prior work.

**Cross-cutting edge cases:**

- **Position effects** — models can attend less reliably to material buried in the middle of a very long context ("lost in the middle"). A bigger window is not a free pass; placement matters.
- **Budget contention** — a near-full input starves the output; reserve headroom for the response.
- **Cost and latency scale with tokens** — the largest window is rarely the cheapest answer.
- **Combining strategies** is normal: e.g. sliding window for recent turns + summary for older history + retrieval for reference data.

The skill is matching strategy to content and accepting its failure mode knowingly, rather than assuming any single technique is "safe."

## How each role uses this

- **Developer/Engineer:** Selects and *combines* strategies, reserves output headroom, and instruments token usage; mitigates lost-in-the-middle by ordering critical content deliberately.
- **Business Analyst:** Flags which facts are non-negotiable so summarization and checkpointing never compress them away, and defines what "correct retrieval" means for the domain.
- **PM/Product Owner:** Weighs the cost/latency of large windows vs retrieval, and accepts the residual risk of each strategy's failure mode when prioritizing.
- **QA & Architect:** Designs adversarial tests — early constraints that must survive long chats, retrieval with missing/stale chunks, mid-context facts — and chooses an architecture whose failure mode is tolerable for the use case.
