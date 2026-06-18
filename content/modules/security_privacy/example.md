# Worked Example: A Production Stack Trace Full of Customer Emails

**Phase: debugging in production support.** A developer, Maya, is on call. A checkout
service is throwing 500s, and the error tracker shows a long Java stack trace. To get help
fast, she is about to paste the entire trace into a consumer AI chatbot she uses at home —
one with no company agreement and no retention controls.

**What the trace actually contains.** Scrolling up, the stack trace includes the failing
request payload: three real **customer email addresses**, a **full billing address**, and —
embedded in a logged config object — a live **payment-gateway API key**. Pasting this would
send personal data and a production secret to an external provider that, under its free-tier
terms, **retains prompts and may use them for training**. The customer data could also land
on servers in another region, breaking the company's **data-residency** commitment.

**The safer path.** Maya stops and applies minimisation:

- **Redact first.** She replaces the three emails with `user1@example.com`, swaps the
  billing address for a placeholder, and removes the API key entirely. None of those values
  is needed to diagnose a null-pointer exception.
- **Use a sanctioned tool.** Instead of her personal chatbot, she uses the company's
  approved AI assistant, which runs under an enterprise agreement with **zero retention** and
  a **no-train** guarantee.
- **Keep it out of logs.** She notes that the API key should never have been logged in the
  first place and files a ticket to scrub secrets from log output.

**The outcome.** Maya gets the same debugging help — the model only needed the exception
type and the line numbers — without leaking a single customer's PII or a production
credential. The fix that mattered was not the model; it was **what she chose not to send**.
