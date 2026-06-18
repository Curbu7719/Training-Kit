# Hints — Tokens

## Alternative phrasings of the core idea

- A token is the small chunk — often a piece of a word — that an LLM actually reads and
  generates; text is split into tokens before the model sees it.
- Models think in tokens, not words: pricing and context limits are both measured per
  token, so word counts are only a rough proxy.
- "Tokenization" is just the step that chops your text into these sub-word pieces before
  the model processes it.

## Hint stack

- **H1 (nudge):** Remember that a token is usually *smaller* than a word. What unit does
  the question really want you to count or reason about?
- **H2 (structural):** Use the rough ratio **100 tokens ≈ 75 words** to convert. And
  remember input tokens and output tokens are counted — and priced — separately.
- **H3 (near-answer):** Take the word count, multiply by 100/75 (about 1.33) for a token
  estimate. Long words, numbers, and punctuation push the real count higher, so treat the
  estimate as a floor and count exactly when cost matters.

## FAQ

**Q: Is one token always one word?**
No. Common short words are often one token, but longer or rarer words split into several
tokens. Spaces, punctuation, and numbers also affect the split, so 1 word ≠ 1 token.

**Q: Do input and output tokens cost the same?**
Usually not. Most providers bill input and output separately, and output tokens are often
more expensive. Always budget the two apart.

**Q: How do I get an exact count instead of an estimate?**
Use a tokenizer tool or library for your specific model. Each model family tokenizes a
little differently, so counts can vary between models for the same text.

**Q: Why do context limits matter if I'm only sending a short prompt?**
Because input *and* output share the same context window. A short prompt that triggers a
very long response can still hit the limit.
