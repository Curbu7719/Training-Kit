# Hints — Tokens

## Alternative phrasings of the core idea

- A token is the small chunk — often a piece of a word — that an LLM actually reads and
  generates; a diff, a log, or a spec is split into tokens before the model sees it.
- Models think in tokens, not words: the cost of an AI reviewer and the size of file it
  can read are both measured per token, so word/line counts are only a rough proxy.
- "Tokenization" is the step that chops your text — including source code and logs — into
  these sub-word pieces before the model processes it.

## Hint stack

- **H1 (nudge):** A token is usually *smaller* than a word, and code tokenizes heavier than
  prose. What unit does the question really want you to count or budget?
- **H2 (structural):** Use **100 tokens ≈ 75 words** for prose to convert, but count code
  exactly with a tokenizer. Remember input tokens (the diff/log you send) and output tokens
  (the AI's comments) are counted — and priced — separately.
- **H3 (near-answer):** For cost, multiply tokens-per-request by request volume by the
  per-token price, and do input and output separately. For limits, check whether the file
  fits the context window before sending — chunk it if not.

## FAQ

**Q: Is one token always one word?**
No. Common short words are often one token, but longer words split into several, and source
code splits even more (braces, indentation, identifiers). So 1 word ≠ 1 token.

**Q: Do input and output tokens cost the same?**
Usually not. Most providers bill input and output separately, and output is often more
expensive. When budgeting an AI reviewer, count the diff (input) and the comments (output)
apart.

**Q: Why would a huge file blow the budget *or* the limit?**
A 20,000-line generated file is a huge number of input tokens — expensive — and may simply
exceed the model's context window, so it won't fit in one call at all. Chunk or skip it.

**Q: How do I get an exact count instead of an estimate?**
Use a tokenizer tool or library for your specific model. Each model family tokenizes a
little differently, and code especially varies, so always measure when cost matters.
