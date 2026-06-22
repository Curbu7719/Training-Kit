# Worked Example: Make a Prompt Other Software Can Depend On

Your prompt turns a spec into a test plan that downstream tooling reads automatically. It worked in the demo and broke in production — because a demo tolerates prose and production needs a contract. Here's how the advanced patterns make it dependable, and why that's worth the effort.

**Few-shot done well.** You don't paste three near-identical happy-path examples; you paste the easy case *and* the awkward ones — empty input, a weird edge case. *Why?* The examples *are* the spec — show only happy paths and the model breaks on the first odd input. Diverse examples buy you reliability where it actually fails.

**A strict output contract.** You stop asking for "a test plan" and ask for a named JSON schema, wrapped in delimiters, "return only this." *Why use AI here at all?* Because now downstream code can rely on the result instead of regexing prose — and you **validate** the JSON before use, repairing or rejecting on failure rather than shipping a malformed plan.

**Reason, then return only the answer.** For a tricky spec you let the model reason step by step — but you tell it to return *only* the final structured plan. *Why?* The reasoning improves the answer; the downstream tool would choke on the thinking. You get the quality without the mess.

**Treat the prompt as code.** You put it in version control, not inline. *Why use AI here in the first place?* Because a prompt that other software depends on *is* software — when it changes, you want a diff, a review, and the ability to roll back, same as any other production change.

**The takeaway:** the jump from demo to production isn't a cleverer prompt — it's diverse examples, a validated output contract, and versioning. That's what lets you point real tooling at AI output and trust it.
