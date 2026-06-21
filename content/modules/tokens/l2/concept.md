# Token Mechanics & Budgeting

L1 introduced the token — the sub-word unit a model reads, and why "1 word ≠ 1 token." L2 goes
deeper into *why* tokenization behaves the way it does and how to turn that into a **reliable cost
and context budget**. This is the mechanics under the bill, separate from the optimization levers
(caching, routing, streaming) covered in the Cost & Latency module.

**A running example.** Your **AI PR-review bot** runs on every pull request. To approve its budget
and keep it inside the context window, you need to forecast its tokens precisely — not guess.

## Why code and other text tokenize "heavier"

Tokenizers split text into sub-word units learned from data (a BPE-style scheme). Consequences:

- **Punctuation, whitespace, and symbols cost tokens.** Code is dense with `(){};`, indentation,
  and operators that prose doesn't have, so a 400-line diff is far more tokens than a 400-line essay.
- **Rare or compound words split into more pieces.** A common word may be one token; an unusual
  identifier like `getUserAccountByIdOrThrow` splits into several.
- **Special / control tokens exist.** Messages carry hidden structural tokens (role markers,
  delimiters) that also count, so the billed total is a little above your visible text.

## The multilingual penalty

Tokenizers are usually optimized for English. The **same sentence in Turkish (or other non-English
languages) often costs noticeably more tokens** than in English, because the model breaks those
words into more sub-word pieces. If your feature processes non-English text, budget for that
overhead rather than using the English rule of thumb.

## Counting: estimate vs exact

- **Estimate** for a first pass: roughly **100 tokens ≈ 75 English words** — fine for a rough
  sizing.
- **Count exactly** for anything cost-sensitive: run the text through **your chosen model's
  tokenizer**. Different model families tokenize differently, so a count from one isn't valid for
  another.

## Budgeting the bill

Cost is **tokens × per-token price**, with **input and output priced separately** and **output
usually more expensive**. To forecast a feature:

> monthly cost ≈ requests/month × (avg input tokens × input price + avg output tokens × output price)

For the PR bot: 800 PRs × (6,000 input + 1,000 output) tokens, output weighted higher. Output
volume matters more than its token count suggests — keep that in the estimate.

## Budgeting the context window

Tokens are also a **space** budget. The window holds input *and* output, so allocate it
deliberately: system instructions + retrieved context + conversation history must leave a
**reserve for the output**. A common mistake is filling 98% of the window with input and leaving
no room for the answer.

## How each role uses this

- **Developer/Engineer:** Counts tokens with the real tokenizer before sending large diffs, and
  budgets the window so input never crowds out the output reserve.
- **Business Analyst:** Estimates per-analysis token cost — including the non-English overhead — so
  spend per document is known up front.
- **PM/Product Owner:** Forecasts monthly spend from request volume and the input/output token mix,
  and sets output caps where the bill is output-driven.
- **QA & Architect:** Tests behaviour near the window limit and designs chunking/truncation so long
  inputs degrade deliberately instead of overflowing.
