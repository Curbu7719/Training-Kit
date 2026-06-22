# Security & Privacy of AI in the SDLC

When you bring an AI assistant into software work, every prompt you send becomes **data that
leaves your control**. The model provider receives whatever you paste — source code, stack
traces, customer records. The provider may **keep** it, **log** it, or even use it to
**train** future models, unless your plan says it will not. Security and privacy here is
about three things: knowing what you send, knowing where it goes, and keeping sensitive data
out of places it should never reach.

**PII and sensitive data.** Personal data (names, emails, health or payment records) and
private source code are the two things most often leaked by accident. (PII means personal
data.) If you paste a real production database row or a real customer ticket into a chatbot,
that data can move across borders (a **data residency** problem — rules about which country
the data may sit in) and into a vendor's logs. The fix is **minimisation**: send the least
data you need. Also **redact** PII and secrets before the prompt ever leaves your machine.
(Redact means remove or hide the sensitive parts.)

**Prompt and data leaks.** Sensitive context can leak in several ways. A **prompt injection**
hidden in a document can trick the model into sending data out. A developer can paste an API
key or password straight into a prompt. Sensitive output can get written to **logs** that
anyone can read. A model can **memorise** training data and repeat it later. And in
multi-tenant systems (where many customers share one system), weak separation can leak one
customer's data into another customer's session.

**Shadow AI.** The biggest everyday risk is unapproved tools. Developers paste code or data
into random consumer chatbots that have no enterprise agreement, no zero-retention setting,
and no policy. (Shadow AI means AI tools used without approval.) Banning AI just pushes this
underground. Instead, bring it into the open: offer **sanctioned tools** (approved tools), a
clear policy, and training on what is and is not allowed.

**Practical safeguards across the SDLC.** Classify data so people know what is sensitive.
Redact and scan for secrets before sending. Use an **approved-tool list**. Turn on
**no-train / zero-retention** settings. Keep prompts and AI output out of plain logs. Add
**review gates** before AI output reaches production.

## How each role uses this

- **Security Engineer:** Redacts PII and secrets before prompting. Tests for data leaks and prompt injection. Keeps prompts and model output out of shared logs.
- **Developer:** Uses only approved tools with zero-retention turned on. Wires redaction and secret scanning into the workflow.
- **Governance:** Classifies which data is sensitive or regulated. Owns the approved-tool list and policy. Decides which tools are approved and where review gates are needed.
- **Enterprise Architect:** Designs tenant separation, clean logging, and no-train data flows, so sensitive data never escapes.
