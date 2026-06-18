# Hints — Security & Privacy

## Alternative phrasings of the core idea

- Every prompt you send to an AI provider is data leaving your control — security and privacy
  is about knowing what you send, where it goes, whether it's retained or trained on, and
  keeping PII, secrets, and proprietary code out of it.
- The three big risks are sending sensitive data (PII, source code) to a provider, leaks
  (prompt injection, pasted secrets, logs, memorisation), and shadow AI (unsanctioned tools).
- The safeguards are practical SDLC habits: classify data, redact and scan before sending,
  use approved tools with zero-retention/no-train, keep AI text out of logs, and add review
  gates before output ships.

## Hint stack

- **H1 (nudge):** Before you paste, ask: what's actually *in* this text? A stack trace, a log,
  or a database row often carries emails, addresses, or an API key you didn't mean to send.
- **H2 (structural):** Separate the problem into *what you send* (minimise and redact PII and
  secrets), *where it goes* (approved tool, zero-retention, data residency), and *what it
  produces* (keep output out of plain logs; review before it ships).
- **H3 (near-answer):** The fix is rarely the model — it's what you choose **not** to send.
  Redact before prompting, use a sanctioned zero-retention tool instead of a random chatbot,
  and never let secrets or PII reach a vendor's logs or training set.

## FAQ

**Q: If the answer the AI gives is correct, why does it matter what I pasted?**
Because the prompt itself is the leak. Once PII or a secret leaves your machine, it may be
retained, logged, used for training, or stored in another region — regardless of the answer.

**Q: What is "shadow AI"?**
Developers or teams using unsanctioned AI tools — pasting code or data into consumer chatbots
with no enterprise agreement, no retention controls, and no policy. Banning AI hides it;
offering sanctioned tools brings it into the light.

**Q: What does zero-retention / no-train actually mean?**
A contractual or configuration setting where the provider does not store your prompts after
processing and does not use them to train future models. It's the baseline for sending any
work data to a model.

**Q: Isn't redaction overkill for a quick debugging question?**
No — redaction is cheap and the data usually isn't needed. An exception type and line numbers
diagnose the bug; the customer's email and the API key add nothing but risk.
