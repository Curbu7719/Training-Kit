# Worked Example: Taking AI Ticket-Triage From Idea to a Gated Pilot

A stakeholder asks for it in a sentence: *"Let's add AI to auto-route our support tickets."*
As the project manager, here's how you turn that into a managed experiment instead of an
open-ended build.

## Step 1 — Define success as a number, up front

Before any code, you and the business agree the **success metric and threshold**:

> The pilot succeeds if **≥ 85%** of tickets are routed to the correct team, measured on a
> **labelled sample of 500 real tickets**, at a cost of **≤ $0.01 per ticket**.

You also name the **kill condition**: if the spike can't get within reach of 85% on real
data, you stop and report — no open-ended "let's keep tuning."

## Step 2 — Spike before you commit a date

You don't promise a launch date yet, because the unknown is *whether the model is good enough
on your messy tickets*. You budget a **two-week feasibility spike**: run the model over the
500 labelled tickets and measure. **Data readiness** is the first dependency — it turns out
only 300 tickets are cleanly labelled, so step one of the spike is labelling, not modelling.

## Step 3 — Stand up the AI risk register

| Risk | Owner | Mitigation |
|---|---|---|
| Tickets aren't labelled enough to evaluate | BA | Label 500 before the spike |
| Model below 85% on ambiguous categories | Eng | Scope pilot to high-volume easy categories first |
| Cost per ticket too high at full volume | PM | Route only low-confidence tickets to the model |
| PII in ticket text leaves the boundary | Architect | Mask PII before the model call (governance gate) |

## Step 4 — The spike result and the honest gate

The numbers come back: **overall 78%**, but **91% on the five highest-volume categories** and
near-random on a long tail of rare ones. This is the moment the whole discipline pays off. You
have three honest options at the gate — and "we already spent two weeks, ship it anyway" is
**not** one of them:

- **Proceed as-is** — rejected; 78% overall would misroute too many tickets and erode trust.
- **Narrow the scope** — chosen: the pilot triages only the five high-volume categories (where
  it hits 91%) and sends everything else to the existing manual queue. That clears the bar on a
  real, valuable slice.
- **Kill** — held in reserve if even the narrowed scope hadn't cleared 85%.

## Step 5 — Eval-based acceptance, then the pilot gate

You write **acceptance criteria** QA can actually check: routing accuracy ≥ 85% on the
held-out set *for the in-scope categories*, PII guardrail passing 100%, cost ≤ $0.01/ticket,
and a human able to override any routing. The pilot runs for the agreed window with these as
the go/no-go for production.

## The lesson

Nothing here required predicting the model's accuracy in advance — which is exactly the point.
By running the feature as a **gated experiment** (success defined as a number, a spike before
a date, a risk register, eval-based acceptance, and a gate where *narrow* and *kill* are real
options), the PM converted an open-ended "add AI" request into a bounded bet that either earns
its next stage or frees its budget. That's delivering an AI project.
