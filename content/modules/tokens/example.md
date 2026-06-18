# Worked Example: Budgeting an AI Code-Review Bot

**Phase: continuous integration / code review.** A platform team wants to add an AI
reviewer that comments on every pull request. Before turning it on, they estimate the
token cost so they can budget the feature for the month.

**What goes in.** On a typical PR the bot reads the diff plus a little surrounding code —
about **600 lines**. Source code is token-heavy: braces, indentation, and identifiers all
cost tokens, so the team does not use the prose ratio. They run one representative diff
through a tokenizer for their model and measure **~9,000 input tokens**. They also prepend
a fixed instruction prompt ("Review this diff for bugs, security issues, and style…") of
about **300 tokens**, so input is **~9,300 tokens** per PR.

**What comes out.** The bot writes roughly **400 words** of review comments. Using the
rough output guess of `400 ÷ 75 × 100 ≈ 530 output tokens`, they round to **~550 output
tokens**.

**Per-PR cost.** Because input and output are billed separately, they cost them apart.
Suppose their model charges \$3 per million input tokens and \$15 per million output tokens:

| Part | Tokens | Rate (per 1M) | Cost |
|---|---|---|---|
| Input (diff + prompt) | 9,300 | \$3 | \$0.0279 |
| Output (comments) | 550 | \$15 | \$0.0083 |
| **Per PR** | | | **~\$0.036** |

**Scaling to a month.** The team merges about **1,500 PRs/month**, so the estimate is
`1,500 × \$0.036 ≈ \$54/month` — cheap enough to approve.

**The catch they check for.** One huge PR (a generated migration of 20,000 lines) would
blow past the model's context window entirely, so the bot is configured to **skip or
chunk** diffs over a token threshold rather than fail.

**The takeaway:** estimate per request, separate input from output, multiply by volume —
and guard against the single oversized file that breaks the budget *and* the context limit.
