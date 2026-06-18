# What Are Guardrails?

**Guardrails** are the controls you put around an AI system to keep its behaviour safe,
on-brand, and within policy. They act on **both sides** of the model: they check and
shape what goes *in* (the input) and what comes *out* (the output). A model on its own
will try to answer almost anything; guardrails are the rules and filters that decide what
it is actually allowed to receive and return.

**An analogy.** Think of guardrails on a mountain road. The road (the model) can take you
many places, but the barriers along the edge stop the car from going somewhere dangerous.
They don't drive for you — they constrain where the journey can go.

**Why guardrails matter.** Three pressures make them essential:

- **Safety.** Prevent harmful, illegal, or abusive content from being produced.
- **Brand and compliance.** Keep responses consistent with company tone, legal rules, and
  regulations (for example, not giving medical or financial advice you're not allowed to).
- **Attacks.** Users may attempt **prompt injection** (hiding instructions in data the
  model reads) or **jailbreaks** (tricking the model into ignoring its rules). Guardrails
  are a key defence.

**Common techniques.** No single control is enough, so guardrails are layered:

- **Input validation** — reject or sanitize inputs that are malicious, off-topic, or
  malformed before they reach the model.
- **Output filtering / moderation** — scan the model's response and block or redact unsafe
  content before the user sees it.
- **Allow / deny lists** — explicitly permit certain topics, words, or actions and forbid
  others.
- **System-prompt constraints** — instructions baked into the model's setup that define
  its role and limits.
- **Refusals** — letting the model decline requests that violate policy.
- **Human-in-the-loop** — routing risky or high-impact responses to a person for approval.

**Defense in depth.** Because any one layer can be bypassed, good systems combine several
so that if one fails, another still catches the problem.

## How each role uses this

- **Developer/Engineer:** Implements input validation and output moderation in the request
  pipeline and writes system-prompt constraints, layering them for defense in depth.
- **Business Analyst:** Captures which topics, claims, and tones are forbidden or required
  so guardrail rules map directly to compliance and brand requirements.
- **PM/Product Owner:** Decides acceptable risk, where human-in-the-loop review is worth
  the cost, and how refusals should be worded for a good user experience.
- **QA & Architect:** Tests guardrails against prompt injection and jailbreak attempts and
  designs the layered architecture so no single control is a single point of failure.
