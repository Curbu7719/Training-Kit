# Operating an Agent-Driven SDLC & Ops

In an AI-driven SDLC the agents don't just *write* code — they increasingly **run** it. AI agents
now take a growing share of operations and delivery-pipeline work: a coding agent opens PRs, a CI
agent triages failing builds, an **on-call agent** receives an alert, investigates, and proposes —
or applies — a fix. The crucial shift from a normal AI feature is that an agent is **not a tool you
call and read the output of; it is an actor that takes actions in your systems**. This module is
the on-call view of *that* world: how you direct, bound, observe, and stay accountable for agents
that act on your software.

**A running example.** Your platform team has wired agents into the SDLC and ops: a CI agent that
triages red builds, an infra agent that proposes scaling changes, and an **on-call agent** that
picks up alerts, investigates with read tools, and remediates. Building those agents is done; now
you operate a system where software increasingly acts on itself — and it fails in ways a script
doesn't.

## From tool to actor — the autonomy shift

A called tool returns text and a human decides what to do with it. An **agent takes the action**:
it restarts a service, pushes a config, scales a cluster, acks an alert, runs a command. So the
blast radius is no longer "a wrong *answer*" — it's a wrong *action*, taken confidently, fast, at
3 a.m. Operating reliably stops being about output quality and starts being about **bounding what
the agent is allowed to do.**

## Bound the blast radius — the core control

Because an agent can act, the central discipline is limiting the damage a wrong action can cause:

- **Least privilege** — the agent gets the narrowest credentials for its job; **read-only by
  default**, write access granted per action class, never a standing admin key.
- **Environment scoping** — free to act in staging, but production actions are gated.
- **Plan-then-apply / dry-run** — the agent proposes the concrete change and its expected effect
  before anything executes.
- **Approval gates** — anything destructive, irreversible, or production-facing requires a human
  to click go. Low-risk, reversible actions can run autonomously.

## Observe the agent, not just the app

App metrics tell you the service is up; they don't tell you the agent restarted the *wrong* one.
You need an **action audit trail**: for every step, what the agent **did** (which tools it called),
what it **observed**, and **why** it decided — a reasoning-plus-action trace, correlatable to the
incident it touched. "200 OK" is not evidence the agent did the right thing.

## Human-in-the-loop and accountability

Set the autonomy level **per action class**, by blast radius:

- **Suggest-only** — agent proposes, a human applies (good for high-impact or new behaviour).
- **Approve-then-act** — agent prepares the action, a human clicks go.
- **Autonomous** — agent acts and notifies (only for low-risk, reversible classes).

Wire a **kill-switch** that pauses *all* agent autonomy instantly, clear escalation paths, and the
rule that a **human stays accountable** for every action. "The agent did it" is not an answer in a
postmortem.

## Agent-specific failure modes

- **Looping** — the agent retries a failing action forever, burning cost or repeating damage.
- **Confident-but-wrong remediation** — it acts decisively on a wrong diagnosis and makes the
  incident *worse* (restarts a healthy service, masks the real fault).
- **Cascading actions** — one automated fix trips another agent or alert, a chain no human chose.
- **Prompt injection as an attack surface** — a crafted log line, ticket, or error message steers
  the agent into running something dangerous. Now that the agent can *act*, injection is an ops
  risk, not just a content risk.

## How each role uses this

- **DevOps / SRE & Infrastructure Engineer:** Sets least-privilege, environment scoping, dry-run
  and approval gates, builds the action audit trail and the kill-switch, and puts action-rate
  limits in place to catch loops.
- **Developer:** Defines the agent's tools and the blast-radius class of each action, and keeps
  prompt/tool changes behind flags for instant rollback.
- **Release / Project Manager:** Decides which action classes may run autonomously vs need
  approval, and owns the escalation path when an agent stops and asks.
- **QA, Governance & Security Engineer:** Designs the approval policy, the audit/accountability
  trail, and the input-trust boundary, and validates the kill-switch and failure modes before an
  agent acts in production.
