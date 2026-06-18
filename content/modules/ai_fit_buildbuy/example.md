# Worked Example: Sourcing a "Smart Reply Suggestion" Feature

**The team.** A SaaS help-desk product wants to add **suggested replies**: when an agent
opens a customer ticket, the app proposes a draft response they can edit and send. The PM,
a developer, and an architect sit down to decide how to source it.

**Step 1 — Is AI even the right tool?** The drafts depend on free-form ticket text and must
read naturally, so this is fuzzy, language-shaped work — a good fit for an LLM. They double
check by carving out the parts that are *not* AI: looking up the customer's plan and order
history is an exact database query, so that stays deterministic code. Only the **draft
wording** goes to AI.

**Step 2 — Accuracy and non-determinism.** A suggestion that is "mostly right" is fine
because a human **edits before sending** — so they can tolerate the model's
non-determinism. They would *not* tolerate it if the reply auto-sent unreviewed.

**Step 3 — Build vs buy vs fine-tune vs API.** They weigh four options:

- **Buy** a help-desk add-on that does suggested replies — fastest, but it is generic and
  creates **vendor lock-in** on their core support workflow.
- **Build** a model in-house — they have neither the training data nor a reason to, since
  reply-drafting is not their differentiator.
- **Fine-tune** — tempting, but they have no labeled dataset yet.
- **Call an API** (a hosted LLM) with a good prompt — low upfront cost, ships in weeks.

**Decision.** They **call a hosted LLM API** behind a thin internal **abstraction layer**,
feeding it the ticket plus retrieved account facts. The abstraction keeps **switching costs**
low — they can change providers later. They log volume to track real **TCO**, and plan to
**fine-tune** only if quality plateaus once they have collected edited-reply data.

**Why this is the right call.** AI fits the fuzzy part only; the deterministic lookup stays
code; a human gate absorbs the non-determinism; and starting with an API behind an
abstraction gets value fast while keeping every later option — buy, fine-tune, or build —
open at low lock-in.
