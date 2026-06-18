# Worked Example: Counting Tokens in a Support Reply

A team is building an assistant that drafts customer-support replies. They want to
estimate the token cost of a single request before turning the feature on.

**The input prompt** the model receives is:

> "You are a helpful support agent. Reply politely to this customer message:
> 'My order #4521 hasn't arrived and I want a refund.'"

That input is about **34 words**. Using the rough rule of **100 tokens ≈ 75 words**,
they estimate the input at roughly `34 ÷ 75 × 100 ≈ 45 tokens`. Note that the order
number `#4521` does *not* count as one neat token — digits and the `#` symbol often
split into several tokens each, so the real count is usually a little higher than the
word-based guess. This is exactly why "1 word ≠ 1 token."

**The output** the model generates is a 3-sentence reply, about **60 words**, which
estimates to roughly `60 ÷ 75 × 100 ≈ 80 output tokens`.

**Putting it together for pricing.** Because input and output are billed separately,
the team budgets them separately:

| Part | Approx. words | Approx. tokens |
|---|---|---|
| Input (prompt) | 34 | ~45 |
| Output (reply) | 60 | ~80 |
| **Total** | 94 | **~125** |

**Checking the estimate.** Before launch they run the same prompt through a tokenizer
library for their model and get **52 input tokens** and **78 output tokens** — close to
the estimate, but the input was undercounted because of `#4521`. They use the exact
counts for the cost model.

**The takeaway:** the rough ratio is fine for a first pass, but anything that drives a
billing decision should be counted exactly, and input vs. output tokens should always be
tracked apart because they are priced apart.
