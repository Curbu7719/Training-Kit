# Hints & FAQ

## Alternative phrasings

- RAG lets a coding assistant take an *open-book exam* over your repo: instead of answering from memory, it first looks up the relevant files and wiki pages, then answers from those.
- Think of it as **search + generation glued together**: a search step finds the right code/doc passages, then the model writes a natural-language answer using them.
- It's a way to give a model knowledge it was never trained on — your codebase, freshly updated each merge — without retraining the model itself.

## Hint stack

- **H1 (nudge):** The pipeline has two phases. One happens *before* any question is asked; the other happens *when* a developer asks something. Which steps prepare the repo+wiki, and which steps respond to a query?
- **H2 (structure):** Indexing comes first and runs once (refreshed on merge): chunk → embed → store. Query time runs per question: retrieve → augment → generate. You can't retrieve from an index that doesn't exist yet.
- **H3 (near-answer):** Order: (1) chunk the repo and wiki, (2) embed each chunk, (3) store vectors in the index, (4) embed the developer's question and retrieve top-k similar chunks, (5) augment the prompt with them, (6) generate the answer. Embedding the question reuses the same model as step 2.

## FAQ

**Does RAG retrain or fine-tune the model on our code?** No. The model's weights stay frozen. RAG only changes the *prompt* by adding retrieved passages. That's why you can update answers just by re-indexing changed files after a merge.

**Why use embeddings instead of keyword search over the repo?** Embeddings capture *meaning*, so "retry a failed job" can match a page titled "backoff and re-queue policy" with no shared words. Keyword grep would miss it.

**What is "top-k"?** The number of most-similar chunks you retrieve and feed to the model — e.g., k=4 means the four closest passages. Too few risks missing the answer; too many adds noise and cost.

**Does RAG guarantee the assistant won't hallucinate an internal API?** No — it greatly reduces it by grounding answers in real code, but the model can still misread or overreach. That's why citations to real files and groundedness testing matter.
