# Worked Example: One Feature, Two Tools

A support team wants a new screen. When an agent opens a customer email, the app should:

1. **Draft a reply** the agent can edit before sending.
2. **Show the customer's exact current balance.**
3. **Tag the email** with a category (Billing, Technical, Cancellation, Other) so it routes to
   the right queue.

The reflex is "let's build it with AI." Let us run each part through the three questions
instead.

**Part 1 — Draft the reply.** *Can I write the rule?* No — every email is different, and the
reply is free-text language. *Is it fuzzy language/judgment?* Yes. *What if it is wrong?* A
human edits it before sending, so "probably right" is fine. → **AI.** This is exactly the
open-ended language work a model is good at.

**Part 2 — Show the exact balance.** *Can I write the rule?* Yes — it is a single number in the
database. *What if it is wrong?* A wrong balance is unacceptable, and it must be exact and the
same every time. → **Deterministic**: a database query. *Why not AI?* Asking a model to produce
an exact figure is the classic trap — slower, costs money, and can be confidently wrong at
something a query never gets wrong.

**Part 3 — Tag the email.** *Can I write the rule?* Not reliably — the wording varies and a
plain keyword rule misses "I want to close my account" as a cancellation. *Is it fuzzy
language?* Yes. *What if it is wrong?* It routes to the wrong queue, which is annoying but
recoverable — and the category set is **fixed and known**. → **Hybrid**: AI classifies the
messy text, and code checks the answer is one of the four allowed labels (and falls back to
"Other" if not). AI reads the language; a rule guarantees a valid, routable category.

**The design that falls out.** Not "an AI feature" and not "a rules feature" — a mix:
deterministic query for the balance, AI for the reply, AI-plus-a-validator for the tag. Each
part uses the tool that fits it.

**The takeaway.** Do not decide "AI" or "automation" for a whole feature — decide it **per
task**. Run each piece through: *can I write the rule (automation), is it fuzzy language or
judgment (AI), and what happens when it is wrong (usually hybrid — AI proposes, code checks and
does the exact bits)*. That is how you avoid both a flaky model doing a calculator's job and a
mountain of brittle rules trying to read language.
