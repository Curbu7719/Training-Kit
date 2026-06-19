# Delivering an AI Project

Running an AI feature as a project is not like running a normal software project, and the
managers who treat it the same way get burned. A normal feature has a knowable scope and a
binary "done": the form validates, the test goes green, you ship. An **AI feature is
probabilistic** — the same input can produce different output, there's rarely one correct
answer, and you don't know up front whether the model is even good enough at *your* task. So
the project is **discovery-shaped**: closer to running an experiment than pouring concrete.

**A running example.** Your organisation wants to add **AI ticket-triage** — automatically
routing incoming support tickets to the right team. As the project manager you can't just
put it on the roadmap with a fixed date and a "build it" ticket. You have to manage the
uncertainty deliberately. The same discipline applies to any AI initiative — a summarizer, a
document extractor, an assistant.

## The pilot is an experiment, not a deliverable

The single most important shift: **a pilot is a time-boxed experiment with a pre-agreed
success metric and a real willingness to kill it.** Before you start you define what "good
enough" means as a *number* (e.g. "≥ 85% of tickets routed to the correct team, measured on a
labelled sample"), pick a real user group, and agree the threshold below which you stop.
Killing a pilot that doesn't clear the bar is a **success** — it frees budget for a better
bet — not a failure to hide.

## Estimating under uncertainty

You cannot estimate an AI feature like a CRUD screen, because the hard question — *is the
model good enough on our real data?* — is unknown until you test it. So you **estimate the
experiment, not the product**: budget a short **feasibility spike** that runs the model
against real, messy data and measures quality, *before* committing to a delivery date.
**Data readiness** (is the data available, clean, labelled enough to evaluate?) and **eval
readiness** (can we even build a way to measure quality?) are hard dependencies — if either
is missing, that's your first piece of work, not the model.

## The AI risk register

Every AI project carries risks a normal project doesn't. Track them explicitly, each with an
owner and a mitigation:

- **Data risk** — the data isn't available, clean, or labelled enough to train or evaluate.
- **Quality risk** — the model can't reach the accuracy the use case needs.
- **Cost risk** — it works, but per-call cost at real volume breaks the business case.
- **Compliance risk** — a privacy/regulatory gate must clear before it can ship.
- **Vendor risk** — dependence on one provider's model, pricing, or availability.

## Acceptance criteria for fuzzy features

"Done" can't be "the output equals X." Define acceptance as **measurable properties**: eval
scores over the agreed threshold on a held-out set, guardrails passing, cost and latency
within budget, and a human-review sign-off for the launch cohort. This is how QA accepts a
non-deterministic feature and how you know the pilot actually succeeded.

## Stage-gates: feasibility → pilot → production → scale

Move the project through gates, each with explicit go/no-go criteria: a **feasibility spike**
proves the model can hit the bar on real data; the **pilot** proves real users get value; 
**production** makes it monitored and owned; **scale** extends it once value holds. At each
gate the honest options are *proceed*, *narrow the scope*, or *kill* — never "we've spent too
much to stop now."

## How each role uses this

- **Developer/Engineer:** Runs the feasibility spike on real data, builds the eval harness
  that defines "good enough," and surfaces cost and quality numbers the gates depend on.
- **Business Analyst:** Defines the success metric and threshold, and maps the data and
  compliance dependencies that gate the work.
- **PM/Product Owner:** Runs the pilot as a gated experiment, owns the AI risk register and
  the scale-or-kill decision, and manages stakeholder expectations of a probabilistic feature.
- **QA & Architect:** Sets eval-based acceptance criteria, validates the feature against them,
  and designs the gates so a weak pilot is caught before production.
