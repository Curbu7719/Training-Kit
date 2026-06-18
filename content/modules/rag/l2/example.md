# Worked Example: Diagnosing a Failing RAG Answer

A legal-policy assistant runs RAG over a company's internal policy documents. A user asks: *"What is the approval limit for travel expenses in the EU region?"* The assistant replies *"$500"* — but the correct figure, per the current policy, is *€2,000*. The answer is wrong and uncited. Here is how an engineer diagnoses it by inspecting each stage.

**Step 1 — Inspect retrieval.** They log the top-k chunks actually retrieved. The closest chunk is from a *US* travel policy that mentions "$500"; the EU policy chunk ranks 7th, below the k=5 cutoff. So the right passage never reached the prompt. This is a **retrieval failure**, not a generation one — the model answered faithfully from the wrong context.

**Step 2 — Find the root cause.** Two issues compound:
- **No metadata filtering.** The query didn't restrict by region, so US and EU chunks competed freely; semantically they're near-identical ("travel expense approval limit").
- **Pure semantic search.** The exact token "EU" carried little weight against the overall sentence meaning.

**Step 3 — Apply fixes.**
- Add a **metadata filter** on `region = EU`, so only EU policy chunks are candidates.
- Add **hybrid search** so the literal term "EU" boosts the right chunk.
- **Re-rank** the candidate set so the most on-point EU chunk lands in the top few.

**Step 4 — Re-test.** Now the EU chunk retrieves at rank 1. The model answers *"€2,000 (Source: EU Travel Policy, §3.2),"* with a citation that traces to the correct document.

**The lesson.** When a RAG answer is wrong, ask *"was the right chunk even retrieved?"* before blaming the model. Most fixes live in retrieval — filtering, hybrid search, re-ranking, chunking — not in the generation prompt. And a citation that points to the *wrong* source is itself the clue that retrieval, not generation, broke.
