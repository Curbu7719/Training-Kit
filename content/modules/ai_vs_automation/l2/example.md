# Worked Example: Designing an Invoice-Intake Pipeline

Finance receives thousands of supplier invoices a month as PDFs, in dozens of different layouts.
They want to auto-capture each invoice's **number, date, and total**, then post it for payment.
Someone proposes "an AI agent that reads invoices and pays them." Let us design it properly
instead — deciding, at each step, AI or deterministic.

**Step 1 — Read the fields.** Layouts vary wildly, so a fixed template parser cannot cope. This
is genuine perception-over-varied-input work. → **AI** extracts number, date, and total. *But*
we do not trust the raw output.

**Step 2 — Validate (extract-then-validate).** Deterministic code now checks the AI's output:
the invoice number matches the expected format, the date is a real date not in the future, and
the total is a positive amount that matches the line items if present. Anything that fails is
**flagged for a human**, not posted. → **Deterministic** guardrail around the AI.

**Step 3 — Cut cost (deterministic-first).** Many suppliers *do* send a fixed template. For
those, a rule parses the fields for free and instantly; only unknown layouts fall back to the
model. At thousands of invoices a month, sending every one to AI would be a needless bill — so
the cheap exact path runs first, AI second. → **Deterministic-first, AI-fallback.**

**Step 4 — Decide to pay (propose-then-gate).** Paying money is high-stakes, so AI never
triggers a payment. A rule gates it: invoices under a small threshold from a known supplier with
all validations green auto-post; everything else waits for human approval. → **AI proposes; a
rule and a human dispose.**

**Step 5 — Test each half correctly.** The deterministic validators get exact unit tests (this
malformed number must be rejected, this future date must be flagged). The AI extractor gets an
**eval set** of a few hundred real invoices with known correct fields; we measure the extraction
accuracy and the validator pass-rate, and re-run it whenever we change the model or prompt.

**The result.** Not "an AI agent that pays invoices" — a pipeline where AI does the one thing
only it can (read varied layouts), deterministic code does everything exact and safe (validate,
route cheap traffic, gate payments), and each half is tested in the way that fits it.

**The takeaway.** A good hybrid is deliberate: name the patterns (extract-then-validate,
deterministic-first, propose-then-gate), put the AI/deterministic boundary where exactness and
cost demand it, and test the exact parts exactly and the AI parts with an eval set and a
threshold.
