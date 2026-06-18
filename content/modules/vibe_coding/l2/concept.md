# Vibe Coding in Depth: Failure Modes and the Disciplines That Contain Them

At L1 you learned the disciplined loop — clear intent, small steps, read every diff, tests and
version control as a safety net, take the wheel when the AI loops. At L2 the question shifts from
*what the good practices are* to *why they exist*: each discipline is a defense against a
specific, recurring failure mode of AI-generated code. Knowing the failure modes is what lets you
place the disciplines deliberately instead of as ritual.

**The core failure modes.**

- **Silent wrong code.** The code runs, returns a value, and is simply wrong — off-by-one,
  inverted condition, wrong default. Nothing crashes, so "it runs" tells you nothing. *Contained
  by:* tests that assert behaviour, not just absence of errors.
- **Plausible-but-broken.** The output reads like idiomatic, confident code and passes a glance,
  but mishandles an edge case, a null, or concurrency. Its very fluency is the trap. *Contained
  by:* actually reading the diff with the edge cases from your spec in mind.
- **Hallucinated APIs.** The AI invents methods, parameters, or libraries that don't exist, or
  uses a real API with the wrong signature. *Contained by:* running it, and recognizing the loop
  so you take the wheel rather than coaxing a non-existent API into being.
- **Scope creep.** You asked for one endpoint; the diff also "helpfully" refactored unrelated
  modules, changed defaults, or added dependencies. *Contained by:* small, single-purpose prompts
  and rejecting diffs that exceed the ask.
- **Eroded understanding.** The slowest, most dangerous failure: accept enough unread output and
  no one can explain how the system works, so no one can debug, secure, or extend it. *Contained
  by:* the non-negotiable rule — never ship code you don't understand — and keeping a mental model.

**Disciplines as a system, not a checklist.** The disciplines compose like layered defenses, each
catching what the previous one misses. A clear **spec** gives reading and testing a target.
**Small diffs** make reading feasible and isolate scope creep. **Reading** catches plausible-but-
broken logic a test might not cover. **Tests** catch silent wrong code that reads fine. **Version
control** makes every step reversible and reviewable. **Human review gates** stop unverified
output at the boundary. Drop one and the failure it contained walks straight through.

**Keeping a mental model.** The deepest discipline is maintaining an accurate model of the system
in your own head as the AI writes into it. This is what makes architectural coherence possible:
you can only reject a drifting diff, name the right abstraction, or spot a security gap if you
still understand the whole. Velocity that erodes that model is borrowing against debt you will
repay with interest when something breaks.

## How each role uses this

- **Developer/Engineer:** Maps each discipline to the failure mode it contains, reads for
  plausible-but-broken logic, runs to expose hallucinated APIs, and protects the mental model that
  keeps the system coherent.
- **Business Analyst:** Writes intent precise enough that "silent wrong code" has a behavioural
  spec to be caught against, and flags edge cases the AI is likely to mishandle.
- **PM/Product Owner:** Recognizes eroded understanding as accumulating risk, not free speed, and
  budgets for the review and test steps rather than rewarding unread output.
- **QA/Tester & Architect:** Designs tests that assert behaviour to catch silent wrong code,
  red-teams plausible-but-broken edge cases, watches for scope creep, and guards architectural
  coherence against drift.
