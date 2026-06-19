# Agent Ops at Scale — Governance, Incidents & Lifecycle

L1 covered operating a few agents that act: bound the blast radius, observe the actions, keep a
human accountable. L2 is what that becomes at **scale and over time** — a *fleet* of agents acting
across many systems and teams, where their permissions, their decisions, and the cost of their
actions all compound, and the model and tools underneath them **change out from under you**.

**Permissions and policy as code.** At fleet scale you can't grant access agent-by-agent in a
console. Each agent has its own **service identity**, least-privilege scopes, and environment
boundaries, all expressed as **policy-as-code** and reviewed like any change. **Change windows**
apply — no autonomous production actions during a freeze — and the high-blast action classes carry
mandatory approval **uniformly** across every agent, not at each team's discretion.

**Incidents WITH agents and ABOUT agents.** Agents are now both responders and causes, so the
incident taxonomy splits two ways:

- **Agent as responder** — auto-triage, runbook execution, first-line remediation. Useful, but it
  can be wrong.
- **Agent misfire** — it took a wrong action (restarted the wrong service, pushed a bad config).
- **Runaway loop** — repeated or cascading actions burning cost or spreading damage.
- **Compromise via injection** — untrusted text steered an agent into a harmful action.
- **Permission/escalation fault** — an agent reached something it shouldn't have.

The universal control is the same: **pause autonomy (kill-switch)** and **revert the action**. Every
incident ends in a **blameless postmortem** that includes the agent's **decision trace**, and — the
AI-specific twist — every misfire becomes a **new guardrail/policy and an eval case** for the agent's
behaviour, so the same wrong action can't silently recur.

**Auditability, compliance, and accountability.** Every agent action is logged, **attributable** to
an agent identity *and* its human owner, and **reversible** wherever possible. The regulatory
reality is blunt: a human is accountable for what an agent does — "the agent decided" is not a
defence — so audits and postmortems must be able to reconstruct which agent, on what reasoning, took
which action.

**Agentic FinOps.** Each agent step is an LLM call, and the actions may spin up cloud resources, so
a looping or over-eager agent burns money and compute fast. Operate it: **attribute cost per agent**,
**anomaly-detect** runaway loops (deviation from the trend, not just a fixed threshold), cap each
agent's **action rate and spend**, and decide per agent whether crossing a cap should **degrade**
(propose-only) or **stop**.

**Agent lifecycle.** An agent's behaviour is its **policy = prompt + tools + permissions + model** —
all versioned artifacts in source control, reviewed and rolled out like code, never edited live.
Because the agent acts on the world, changes go through a safe path: **shadow** (run it in
observe/dry-run against real events and compare its *proposed* actions to what humans actually did)
→ **canary** (let it act autonomously on a small slice of events) → **rollout** with a one-flip
**policy rollback** ready. A model deprecation or a new tool is a behaviour change like any other.

**The trust ladder.** Maturity is expanding autonomy as evidence accrues: **suggest-only →
approve-then-act → bounded autonomy in low-risk domains → broader autonomy** — and pulling the leash
back in when an agent misbehaves. It's about the policy, audit, and guardrail machinery that lets you
safely give agents a longer leash, not about how clever any single agent is.

## How each role uses this

- **DevOps / SRE & Infrastructure Engineer:** Implements policy-as-code permissions, per-agent cost
  attribution and anomaly alerts, action-rate caps and load-shedding, and the shadow/canary harness
  for agent policy changes.
- **Developer:** Versions the agent's policy (prompt/tools/permissions/model), wires the
  shadow/canary path, and turns each misfire into a guardrail and an eval case.
- **Release / Project Manager:** Owns change windows and the degrade-vs-stop policy per agent, and
  the trust-ladder decision of where autonomy may expand.
- **QA, Governance & Security Engineer:** Designs the incident taxonomy and runbooks, the
  postmortem-to-eval-case loop, the audit/accountability trail, and the injection/permission
  controls, and validates the kill-switch and failover under real failure.
