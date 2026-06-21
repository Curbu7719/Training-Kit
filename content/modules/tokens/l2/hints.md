# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "Tokens are both a money budget and a space budget: cost is tokens × price (input and output
  billed separately, output dearer), and the context window holds input plus output, so you
  forecast both from token counts."
- "Code, symbols, whitespace, and non-English text tokenize heavier than plain English prose, so
  the English rule of thumb under-counts — measure with the chosen model's own tokenizer for
  anything cost-sensitive."
- "Allocate the window deliberately: system + retrieved context + history must leave a reserve for
  the output, or a big input crowds out the answer."

**Hint stack**

- **H1 (nudge):** Two different budgets ride on tokens — the bill and the window. The question is
  usually about forecasting one of them precisely rather than guessing.
- **H2 (structure):** For cost: requests × (input tokens × input price + output tokens × output
  price), output weighted higher. For the window: input + output must fit, so reserve room for the
  answer and chunk oversized inputs.
- **H3 (worked path):** Measure ten real diffs with the model's tokenizer (~6,000 in, ~1,000 out),
  multiply by volume with output costed higher, add the Turkish overhead, and chunk any PR that
  would eat the output reserve.

**Short FAQ**

- **Can't I just use 100 tokens ≈ 75 words?** For a rough first pass, yes. For a real budget, no —
  code and non-English text break into more tokens, so count exactly with the model's tokenizer.
- **Why does output matter more than its token count suggests?** Output is usually priced higher
  per token than input, so trimming verbose output is often the highest-leverage cost control.
- **Why is the multilingual penalty real?** Tokenizers are tuned for English, so the same sentence
  in Turkish (or many other languages) splits into more sub-word tokens and costs more.
- **What's the context-budget mistake to avoid?** Filling the window almost entirely with input and
  leaving too few tokens for the model to actually produce its answer.
