# Worked Example: Choosing a Model for a Support-Ticket Tagger

A team wants to automatically tag incoming support tickets with one of five categories (Billing, Bug, Feature Request, Account, Other). They expect about 50,000 tickets per month and want to see how next-token prediction and model choice play out in practice.

**The task framed for an LLM.** They give the model a prompt like: *"Classify this ticket into exactly one of: Billing, Bug, Feature Request, Account, Other. Ticket: 'I was charged twice this month.' Category:"*. The model continues the text — its most probable next token after `Category:` is ` Billing`. That single high-probability continuation **is** the classification. No database lookup happened; the model recognized the pattern.

**Why a small model fits.** This is a simple, high-volume, well-bounded task. A large flagship model would be more capable than needed, slower per call, and far more expensive across 50,000 calls. The smallest model that classifies reliably wins on **cost and latency** — exactly the capability-vs-cost-vs-latency trade-off.

**Why low temperature.** They set temperature near zero. They want the same ticket to get the same tag every time and the answer constrained to the five allowed words. High temperature would invite creative but unwanted variation like "Payment Issue."

**Where the limits bite.** Knowledge cutoff is irrelevant here — no current-events knowledge is required. But **hallucination** still matters: the model might occasionally invent a sixth category or mis-tag an ambiguous ticket. So the team adds a guardrail — reject any output not in the allowed list and route low-confidence cases to a human.

**Result:** a cheap, fast, mostly-deterministic classifier, with a simple validation layer absorbing the model's probabilistic nature. The model choice followed directly from the task's demands, not from picking "the best" model.
