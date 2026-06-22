# Operating an Agent-Driven SDLC & Ops

In an AI-driven SDLC the agents don't just *write* code — they increasingly **run** it. (An
agent is an AI that does not just answer; it takes actions in your systems on its own.) AI agents
now take a growing share of operations and delivery-pipeline work: a coding agent opens PRs, a CI
agent looks into failing builds, an **on-call agent** gets an alert, investigates, and proposes —
or applies — a fix. The big change from a normal AI feature is this: an agent is **not a tool you
call and then read the output of; it is an actor that takes actions in your systems**. This module is
the on-call view of *that* world: how you direct, limit, watch, and stay accountable for agents
that act on your software.

**A running example.** Your platform team has wired agents into the SDLC and ops: a CI agent that
looks into red builds, an infra agent that proposes scaling changes, and an **on-call agent** that
picks up alerts, investigates with read-only tools, and fixes things. Building those agents is done;
now you operate a system where software increasingly acts on itself — and it fails in ways a script
does not. This is the world the **internal AI Agent platform** we are opening puts into every role’s hands — so the controls in this module are how we will operate it safely.

## From tool to actor — the autonomy shift

A called tool returns text and a human decides what to do with it. An **agent takes the action**:
it restarts a service, pushes a config, scales a cluster, acks an alert, runs a command. So the
blast radius is no longer "a wrong *answer*" — it's a wrong *action*, taken with confidence, fast, at
3 a.m. (Blast radius means how much damage one mistake can cause.) Operating reliably stops being
about output quality and starts being about **limiting what the agent is allowed to do.**

## Bound the blast radius — the core control

Because an agent can act, the main discipline is limiting the damage a wrong action can cause:

- **Least privilege** — the agent gets the smallest set of permissions for its job; **read-only by
  default**, with write access granted per action type, never a standing admin key.
- **Environment scoping** — free to act in staging, but production actions are gated.
- **Plan-then-apply / dry-run** — the agent proposes the exact change and its expected effect
  before anything runs.
- **Approval gates** — anything destructive, hard to undo, or production-facing needs a human
  to click go. Low-risk, easy-to-undo actions can run on their own.

## Observe the agent, not just the app

App metrics tell you the service is up; they don't tell you the agent restarted the *wrong* one.
You need an **action audit trail**: for every step, what the agent **did** (which tools it called),
what it **observed**, and **why** it decided — a record of its reasoning plus its actions, linked to
the incident it touched. "200 OK" is not proof the agent did the right thing.

## Human-in-the-loop and accountability

Set the autonomy level **per action type**, based on blast radius:

- **Suggest-only** — the agent proposes, a human applies (good for high-impact or new behaviour).
- **Approve-then-act** — the agent prepares the action, a human clicks go.
- **Autonomous** — the agent acts and then notifies (only for low-risk, easy-to-undo types).

Wire a **kill-switch** that pauses *all* agent autonomy at once, set clear escalation paths, and keep
the rule that a **human stays accountable** for every action. "The agent did it" is not an answer in a
postmortem.

## Agent-specific failure modes

- **Looping** — the agent retries a failing action over and over, burning cost or repeating damage.
- **Confident-but-wrong remediation** — it acts firmly on a wrong diagnosis and makes the
  incident *worse* (restarts a healthy service, hides the real fault).
- **Cascading actions** — one automated fix sets off another agent or alert, a chain no human chose.
- **Prompt injection as an attack surface** — a crafted log line, ticket, or error message tricks
  the agent into running something dangerous. (Prompt injection is hidden text that tries to hijack
  the AI's instructions.) Now that the agent can *act*, injection is an ops risk, not just a content
  risk.

## How each role uses this

- **DevOps Engineer:** Sets least-privilege, dry-run, and approval gates, builds the action audit trail and the kill-switch, and puts action-rate limits in place to catch loops.
- **Infrastructure Engineer:** Owns environment scoping and the capacity and permissions the agent's actions run within.
- **Developer:** Defines the agent's tools and the blast-radius type of each action, and keeps prompt/tool changes behind flags for instant rollback.
- **Release Manager:** Decides which action types may run on their own vs need approval, and owns the escalation path when an agent stops and asks.
- **Security Engineer:** Owns the input-trust boundary and the approval policy for high-blast actions, and checks the kill-switch and failure modes before an agent acts in production.
- **Governance:** Holds the rule that a human stays accountable for every agent action.
