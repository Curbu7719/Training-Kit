# Security & Privacy of AI in the SDLC

When you bring an AI assistant into software work, every prompt you send becomes **data
leaving your control**. The model provider receives whatever you paste — source code,
stack traces, customer records — and may **retain** it, **log** it, or even use it to
**train** future models unless your plan says otherwise. Security and privacy here is about
knowing what you send, where it goes, and how to keep sensitive data out of places it
should never reach.

**PII and sensitive data.** Personal data (names, emails, health or payment records) and
proprietary source code are the two things most often leaked by accident. Pasting a
production database row or a real customer ticket into a chatbot can move that data across
borders (a **data residency** problem) and into a vendor's logs. The fix is
**minimisation**: send the least data needed, and **redact** PII and secrets before the
prompt ever leaves your machine.

**Prompt and data leaks.** Sensitive context leaks in several ways: a **prompt injection**
hidden in a document tricks the model into exfiltrating data; a developer pastes an API key
or password straight into a prompt; sensitive output gets written to **logs** anyone can
read; or a model **memorises** training data and repeats it. In multi-tenant systems, weak
isolation can leak one customer's data into another's session.

**Shadow AI.** The biggest everyday risk is unsanctioned tools — developers pasting code or
data into random consumer chatbots with no enterprise agreement, no zero-retention
setting, and no policy. Banning AI just drives this underground. Bring it into the light:
offer **sanctioned tools**, a clear policy, and education on what is and isn't allowed.

**Practical safeguards across the SDLC.** Classify data so people know what's sensitive;
redact and scan for secrets before sending; use an **approved-tool list**; turn on
**no-train / zero-retention** settings; keep prompts and AI output out of plain logs; and
add **review gates** before AI output reaches production.

## How each role uses this

- **Developer/Engineer:** Redacts PII and secrets before prompting, uses only approved tools
  with zero-retention enabled, and keeps prompts and model output out of shared logs.
- **Business Analyst:** Classifies which data is sensitive or regulated, so redaction and
  residency rules map directly to compliance obligations.
- **PM/Product Owner:** Owns the approved-tool list and policy, deciding which AI tools are
  sanctioned and where human review gates are required before shipping.
- **QA/Tester & Architect:** Tests for data leaks and prompt injection, and designs tenant
  isolation, logging hygiene, and no-train data flows so sensitive data never escapes.
