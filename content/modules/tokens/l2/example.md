# Worked Example: No More Bill-Shock — Budget the Tool First

You want to add an AI step to your workflow but you're wary of a surprise bill. Here's how thinking in tokens lets you forecast the cost — and design it down — before you commit.

**Measure, don't guess.** Take a handful of real inputs your tool will see and run them through the model's own tokenizer. The PR-review case averages ~6,000 tokens in and ~1,000 out. *Why measure?* Code and your domain text tokenize heavier than a rule of thumb predicts — a guess can be off by a lot.

**Do the math.** Monthly cost ≈ runs × (input tokens × input price + output tokens × output price). The insight that saves money: **output is priced higher**, so trimming verbose output ("top issues only," not an essay) cuts the bill more than trimming input.

**Protect the answer.** A giant input can eat the whole context window and leave no room for the response, so for oversized inputs you chunk them — the tool stays useful instead of truncating.

**The Turkish catch.** If your inputs are Turkish, they cost more tokens than the English rule suggests — add that to the forecast so you don't under-budget.

**Why bother?** Because a five-minute token forecast turns "we might blow the budget" into a number you can defend to your Project Manager — and a tool you can design to stay cheap.
