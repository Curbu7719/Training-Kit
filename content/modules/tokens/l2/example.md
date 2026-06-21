# Worked Example: Budgeting the AI PR-Review Bot

Leadership asks: *"What will the PR-review bot cost per month, and will it fit the model's context
window?"* You answer with token math, not a guess.

## Step 1 — Measure real tokens, exactly

You don't eyeball it. You take ten representative PR diffs plus the surrounding files the bot
sends, and run them through **the chosen model's tokenizer**. The average comes out at **~6,000
input tokens** per review (code tokenizes heavy — braces, indentation, and long identifiers all
cost), and the bot's comments average **~1,000 output tokens**.

## Step 2 — Do the budget math

With ~800 PRs/month and input/output priced separately (output dearer):

> monthly cost ≈ 800 × (6,000 × input_price + 1,000 × output_price)

The key insight you report: **output is the smaller token count but the larger cost driver** per
token, so capping the bot to "the top issues, not an essay" is the highest-leverage budget control.
Halving verbose output saves more than trimming the same number of input tokens.

## Step 3 — Check the context budget

The model's window is, say, 128k tokens. One review uses ~6,000 input + ~1,000 output ≈ 7,000 — so
a single review fits comfortably. The risk is a **giant PR**: a 5,000-line refactor could push
input past a safe fraction of the window, leaving too little **output reserve** for a full review.
You set a rule: if a diff exceeds a token threshold, **chunk it** (review per-file) rather than
sending it whole.

## Step 4 — Account for the multilingual case

The team's commit messages and some docstrings are in **Turkish**. You re-measure: the same text
in Turkish costs noticeably more tokens than the English rule of thumb predicts, so you add that
overhead to the forecast instead of under-budgeting.

## The lesson

The bill and the window are both **token budgets**, and both are forecastable — if you count with
the real tokenizer instead of guessing. Knowing that code and non-English text tokenize heavier,
that output drives cost, and that the window needs an output reserve turns "AI might get expensive"
into a number you can defend and design around. That's token mechanics put to work.
