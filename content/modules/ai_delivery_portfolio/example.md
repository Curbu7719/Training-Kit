# Worked Example: Delivering a Feature with an AI-Assisted Team

A product owner asks for it in a sentence: *"Add bulk receipt upload with auto-categorisation
to the expense app."* The feature is ordinary software — but your team builds it in an
**AI-driven SDLC**, with coding assistants generating most of the code. Here's how you manage
the delivery instead of assuming AI just makes it 3× faster.

## Step 1 — Specify the intent before generating

The assistant is only as good as the intent it's given. Before anyone generates code, you pin
down what "done" means: the accepted file types and size limits, how a receipt maps to a
category, what happens on a failed parse, and the API contract with the existing ledger. Vague
intent produces plausible code that solves the wrong problem fast.

## Step 2 — Estimate the verification, not the generation

The assistant scaffolds the upload endpoint, the parsing service, and a first set of tests in an
afternoon. It *looks* nearly done. You resist quoting a near-term ship date, because the real
work is the **last 10%**: malformed receipts, duplicate uploads, currency edge cases,
integration with the ledger's transaction rules, and reviewing code nobody hand-wrote. You
estimate **that** work — review, integration, verification — not the generation that's already
done.

## Step 3 — Make the quality gates the definition of done

Because the code came fast and confident, the gates are where correctness is actually earned:

| Gate | Owner | What it catches |
|---|---|---|
| Human review of generated code | Engineer | Hallucinated APIs, wrong logic, off-pattern code |
| Automated tests + edge-case suite | QA | Malformed/duplicate receipts, currency cases |
| Type check + security/dependency scan | Architect | Insecure patterns, outdated/echoed dependencies |
| Pattern & architecture check | Architect | Drift from the codebase's conventions |

A change is "done" when it clears these — not when it compiles or the happy-path demo works.

## Step 4 — The honest checkpoint

Review finds it: the assistant's parser handles the demo receipts perfectly but silently
mis-parses non-USD amounts, and it pulled in a dependency with a known advisory. The generated
code was *80% right and 100% confident.* You have three honest options — and "it already works
in the demo, ship it" is **not** one of them:

- **Merge as-is** — rejected; the currency bug would corrupt real ledgers and the dependency
  fails the security gate.
- **Fix and re-verify** — chosen: tighten the intent, regenerate the parser with explicit
  currency handling, swap the dependency, and add the edge-case tests before merge.
- **Hand-write the risky part** — held in reserve for the currency logic if the assistant keeps
  missing it; some code is cheaper to own directly than to keep re-reviewing.

## Step 5 — Report real throughput

At the standup you don't report "the assistant generated 4,000 lines this sprint." You report
**cycle time** (idea to merged-and-verified), **defect escape** (bugs that reached staging), and
the **working value shipped**. The generation was fast; the delivery was paced by review and
verification — and that's the number that tells the truth.

## The lesson

No part of this required predicting how good the model would be — it required managing a workflow
whose bottleneck moved from writing code to **specifying, reviewing, and verifying** it. By
estimating the last 10%, making quality gates the definition of done, and measuring real
throughput instead of output, the lead turned "AI makes us faster" into delivery that's actually
faster *and* safe. That's delivering software in an AI-driven SDLC.
