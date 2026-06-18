# Hints & FAQ

## Alternative phrasings

- RAG is letting the model take an *open-book exam*: instead of answering from memory, it first looks up relevant passages from your data and answers from those.
- Think of it as **search + generation glued together**: a search step finds the right passages, then the model writes a natural-language answer using them.
- It's a way to give a model knowledge it was never trained on — your documents, freshly updated — without retraining the model itself.

## Hint stack

- **H1 (nudge):** The pipeline has two phases. One happens *before* any question is asked; the other happens *when* a question arrives. Which steps prepare the data, and which steps respond to a query?
- **H2 (structure):** Indexing comes first and runs once: chunk → embed → store. Query time runs per question: retrieve → augment → generate. You can't retrieve from an index that doesn't exist yet.
- **H3 (near-answer):** Order: (1) chunk documents, (2) embed each chunk, (3) store vectors in the index, (4) embed the question and retrieve top-k similar chunks, (5) augment the prompt with them, (6) generate the answer. Embedding the question reuses the same model as step 2.

## FAQ

**Does RAG retrain or fine-tune the model?** No. The model's weights stay frozen. RAG only changes the *prompt* by adding retrieved text. That's why you can update answers just by updating documents and re-indexing.

**Why use embeddings instead of keyword search?** Embeddings capture *meaning*, so "reset my password" can match an article titled "account recovery" with no shared words. Keyword search would miss it.

**What is "top-k"?** The number of most-similar chunks you retrieve and feed to the model — e.g., k=3 means the three closest passages. Too few risks missing the answer; too many adds noise and cost.

**Does RAG guarantee no hallucination?** No — it greatly reduces it by grounding answers in real passages, but the model can still misread or overreach. That's why citations and groundedness testing matter.
