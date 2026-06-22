# Worked Example: Why Your AI Tool Suddenly Costs Too Much (or Cuts Off)

Two everyday surprises with AI tools both come down to one thing — tokens — and knowing it saves you money and broken answers.

**Surprise 1: the bill creeps up.** Your team's PR-review bot runs on every pull request and the monthly cost keeps climbing. *Why?* You're billed per token, and code tokenizes heavy — a 400-line diff is far more tokens than it looks, and output costs more than input. Once you know that, you send just the changed hunks and cap the output to the top issues — the bill drops, no feature lost.

**Surprise 2: a big file gets truncated.** You paste a huge file and the answer cuts off halfway. *Why?* Input and output share one context window; you filled it with input and left no room for the answer. Knowing that, you chunk the file or send only the relevant part.

**Forecast before you commit.** Before wiring a new AI step, count real tokens with the model's tokenizer on a few samples and multiply by how often it'll run — so there's no bill-shock at month end.

**One Turkish-specific catch.** The same text in Turkish costs noticeably more tokens than English, so if your tool handles Turkish, budget for the extra.

**Why bother?** Because "AI got expensive" and "AI cut off my answer" are both avoidable once you think in tokens — you keep the tool and lose the surprises.
