# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "Production prompts need an output contract: specify a strict JSON schema (or fixed template),
  tell the model to return only that, and validate before use — don't regex free text and hope."
- "Few-shot teaches house style only when the examples are representative and diverse (including
  edge cases); a versioned prompt gated by an eval set keeps a fix for one case from breaking ten."
- "Treat a prompt like code: parameterize it, keep it in version control, and iterate it against an
  eval set instead of tuning by vibes."

**Hint stack**

- **H1 (nudge):** Ask what makes a prompt *dependable for other software*, not just impressive once.
  The answer is usually a strict output contract plus validation, and a way to change it safely.
- **H2 (structure):** Format (schema + delimiters + validate), teaching (diverse few-shot incl.
  edge cases), ambiguity (flag missing info, don't invent), and lifecycle (version it, gate changes
  with an eval set).
- **H3 (worked path):** Define a JSON schema and validate it; add one ordinary and one edge-case
  example; instruct it to flag assumptions instead of fabricating; move the prompt into version
  control and run an eval set in CI on every change.

**Short FAQ**

- **Why a JSON schema instead of asking nicely for consistency?** Because a defined schema plus
  validation gives downstream code a contract; 'please be consistent' breaks the first time phrasing
  drifts.
- **How many few-shot examples should I use?** Enough to cover the easy and the awkward cases —
  representative and diverse beats many near-identical ones, which just waste tokens.
- **Does a strict format alone guarantee correctness?** No. A schema and validation make the output
  parseable, but you still need good examples and edge-case coverage for it to be actually correct.
- **Why version prompts and use an eval set?** A prompt is production logic; versioning plus an eval
  gate means a change that fixes one case can't silently regress others you didn't re-check.
