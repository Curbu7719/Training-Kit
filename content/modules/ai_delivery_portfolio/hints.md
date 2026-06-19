# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "In an AI-driven SDLC the bottleneck moves from *writing* code to *specifying, reviewing, and
  verifying* it — so you manage intent, review capacity, and quality gates, not typing speed."
- "AI makes generation fast but not the last 10% — edge cases, integration, and debugging
  plausible-but-wrong code — so estimate the review and verification work, not the generation
  that's already done."
- "Generated code is often subtly wrong while looking confident, so quality gates (human review,
  tests, security/type checks) get *more* important, not less, and a human stays accountable for
  what merges."

**Hint stack**

- **H1 (nudge):** Ask what the *constraint* really is once AI writes the code. It isn't typing —
  it's specifying clearly, reviewing trustworthily, and verifying. The whole plan exists to keep
  those from becoming the new bottleneck.
- **H2 (structure):** Walk the workflow. Specify intent → generate → review (correctness,
  security, patterns) → test/verify → integrate. The fast step is generation; price and gate the
  slow ones, and keep *fix-and-re-verify* and *hand-write the risky part* on the table.
- **H3 (worked path):** The assistant produces a parser that's 80% right and 100% confident —
  mis-parses non-USD amounts and pulls a flagged dependency. Don't ship the demo and don't throw
  it all out: tighten intent, regenerate with explicit edge-case handling, swap the dependency,
  add tests, then merge.

**Short FAQ**

- **Doesn't AI just make the project 3× faster?** Generation gets faster; delivery is paced by
  review, integration, and verification, which don't shrink the same way. Output up 3× can still
  mean shipping no sooner if review becomes the bottleneck.
- **Why are quality gates more important now, not less?** Because plausible, confident,
  fast-arriving code is exactly the kind that hides subtle bugs and insecure patterns. The gates
  — human review, tests, security/type checks — are where correctness is actually earned.
- **What's the difference between output and throughput?** Output is lines of code, PR count, "AI
  adoption %" — easy for AI to inflate. Throughput is cycle time, defect-escape rate, and working
  value shipped. Only throughput tells you whether delivery actually improved.
- **What new risks does AI-driven delivery add?** Automation bias (over-trusting plausible code),
  security and IP/licensing of generated code, architectural drift from locally-reasonable
  suggestions, and skill atrophy / unclear ownership of code nobody hand-wrote.
