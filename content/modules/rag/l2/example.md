# Worked Example: Diagnosing a Wrong Codebase Answer

**SDLC phase: Maintenance.** A codebase Q&A assistant runs RAG over a monorepo with several services. A developer asks: *"What's the default request timeout in the `billing` service's HTTP client?"* The assistant replies *"5 seconds"* — but billing's actual default is *30 seconds*; the 5-second value belongs to the `payments` service. The answer is wrong and cites the wrong file. Here's how an engineer diagnoses it stage by stage.

**Step 1 — Inspect retrieval.** They log the top-k chunks actually retrieved. The closest chunk is `payments/http_client.py` ("timeout = 5"); the `billing/http_client.py` chunk ranks 8th, below the k=5 cutoff. So the right file never reached the prompt. This is a **retrieval failure** — the model answered faithfully from the wrong context.

**Step 2 — Find the root cause.** Two issues compound:
- **No metadata filtering.** The query didn't restrict by service, so `billing` and `payments` chunks competed freely; semantically they're near-identical ("HTTP client default timeout").
- **Pure semantic search.** The exact token "billing" carried little weight against the overall sentence meaning.

**Step 3 — Apply fixes.**
- Add a **metadata filter** on `service = billing`, so only billing chunks are candidates.
- Add **hybrid search** so the literal term "billing" boosts the right chunk.
- **Re-rank** the candidate set so the most on-point billing chunk lands in the top few.

**Step 4 — Re-test.** Now `billing/http_client.py` retrieves at rank 1. The model answers *"30 seconds (Source: `billing/http_client.py`)."*

**The lesson.** When a codebase answer is wrong, ask *"was the right file even retrieved?"* before blaming the model. Most fixes live in retrieval — filtering, hybrid search, re-ranking, chunking — not in the generation prompt. And a citation pointing to the *wrong service* is itself the clue that retrieval, not generation, broke.
