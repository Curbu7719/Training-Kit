# Token Mechanics & Budgeting

L1 introduced the token — the sub-word piece a model reads — and why "1 word ≠ 1 token." L2 goes
deeper into *why* tokenization works the way it does, and how to turn that into a **reliable cost
and context budget**. This is the mechanics under the bill, separate from the optimization levers
(caching, routing, streaming) covered in the Cost & Latency module.

**A running example.** Your **AI PR-review bot** runs on every pull request. To approve its budget
and keep it inside the context window, you need to forecast its tokens exactly — not guess.

## Why code and other text turn into more tokens

Tokenizers split text into sub-word pieces learned from data (a BPE-style scheme). What this means:

- **Punctuation, spacing, and symbols cost tokens.** Code is full of `(){};`, indentation,
  and operators that prose does not have. So a 400-line diff is far more tokens than a 400-line essay.
- **Rare or long words split into more pieces.** A common word may be one token. An unusual
  name like `getUserAccountByIdOrThrow` splits into several.
- **Special / control tokens exist.** Messages carry hidden structural tokens (role markers,
  separators) that also count. So the billed total is a little above your visible text.

## The multilingual penalty

Tokenizers are usually tuned for English. The **same sentence in Turkish (or other non-English
languages) often costs many more tokens** than in English, because the model breaks those
words into more sub-word pieces. If your feature handles non-English text, budget for that
extra cost rather than using the English rule of thumb.

## Counting: estimate vs exact

- **Estimate** for a first guess: roughly **100 tokens ≈ 75 English words** — fine for rough
  sizing.
- **Count exactly** for anything cost-sensitive: run the text through **your chosen model's
  tokenizer**. Different model families split text differently, so a count from one is not valid for
  another.

## Budgeting the bill

Cost is **tokens × per-token price**, with **input and output priced separately** and **output
usually costing more**. To forecast a feature:

> monthly cost ≈ requests/month × (avg input tokens × input price + avg output tokens × output price)

For the PR bot: 800 PRs × (6,000 input + 1,000 output) tokens, with output weighted higher. Output
matters more than its token count suggests — keep that in the estimate.

## Budgeting the context window

Tokens are also a **space** budget. The window holds input *and* output, so share it out
on purpose: system instructions + retrieved context + conversation history must leave a
**reserve for the output**. A common mistake is to fill 98% of the window with input and leave
no room for the answer.

## How each role uses this

- **Developer:** Counts tokens with the real tokenizer before sending large diffs, and budgets the window so input never crowds out the output reserve.
- **Project Manager:** Forecasts monthly spend from request volume and the input/output token mix, and sets output caps where the bill is driven by output.
- **Infrastructure Engineer:** Factors the non-English token overhead and provider quotas into capacity and cost planning.
- **Enterprise Architect:** Designs splitting/cutting so long inputs degrade on purpose instead of overflowing the window.
