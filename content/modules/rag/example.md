# Worked Example: A Support Assistant Over a Help Center

A company has a 500-article help center and wants an assistant that answers customer questions using only those articles. A plain language model can't — the articles weren't in its training data. Here's how RAG solves it.

**Indexing (run once, ahead of time).** Each article is split into chunks of roughly 300 words, with a 50-word overlap so a sentence spanning a boundary isn't lost. That yields about 2,000 chunks. Each chunk is passed through an embedding model, producing a vector — say 768 numbers — that encodes its meaning. All 2,000 vectors are stored in a vector index, each tagged with its source article title and URL.

**Query time.** A customer asks: *"My invoice shows the wrong currency — how do I change it?"*

1. **Embed the question** into a vector using the same embedding model.
2. **Retrieve top-k (k=3).** The index returns the three chunks whose vectors are closest to the question's vector. Note the top match comes from an article titled *"Setting your billing region,"* even though it never uses the word "currency" — semantic similarity, not keyword matching, surfaced it.
3. **Augment the prompt.** The three chunks are inserted into the prompt:
   > Answer using only the context below. Cite the article title.
   > Context: [chunk 1] [chunk 2] [chunk 3]
   > Question: My invoice shows the wrong currency...
4. **Generate.** The model writes: *"Go to Billing → Region and select your country; the currency updates automatically. (Source: Setting your billing region.)"*

**Why this works.** The answer is grounded in a real, current article and carries a citation the customer — or a reviewer — can check. If no chunk had been relevant, a well-designed prompt would have the model reply "I couldn't find this in our help center" rather than inventing a plausible-sounding but wrong procedure. Update an article, re-index that chunk, and the assistant's answers update too — no retraining required.
