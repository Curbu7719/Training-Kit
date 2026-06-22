# Worked Example: Use the AI on Real Work Without Leaking It

You want the AI's help on a real bug, which means pasting real code, a real stack trace, maybe a real customer record. The help is worth it — but every paste is data leaving your control. Here's how to keep the speedup and not the incident.

**The reflex: paste the whole failing row.** A bug repro is easiest with the actual production database row. *The risk:* that row has a customer's email and card last-four, and now it lives in a vendor's logs, possibly across a border. *The move:* minimise and redact — paste the schema and a fake row with the same shape. *Why still use AI?* It debugs the logic just as well from a realistic fake as from the real PII — you lose nothing but the exposure.

**The slip: the API key in the snippet.** You paste a config block to ask "why does this fail," key and all. *Why does this matter?* That key is now in someone else's system forever. *The move:* a secret scan (or just a habit) strips credentials before the prompt leaves your machine — and you still get your answer.

**The convenient trap: a random free chatbot.** It's right there, so you paste internal code into it. *The risk — "shadow AI":* no enterprise agreement, no zero-retention, your code may train the next model. *Why use AI here the right way?* The sanctioned tool gives you the same help *with* a no-train setting — same speed, none of the exposure.

**Stay in control.** Before you hit enter, ask one question: "would I be okay if this exact text showed up in a vendor's training set?" If not, redact it first.

**The takeaway:** you don't have to choose between AI's help and keeping data safe. Send the least data that still lets the model help, strip secrets and PII, and use the sanctioned tool — and you get the speedup without handing your crown jewels to a stranger.
