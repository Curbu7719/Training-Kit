# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "An ops agent is not a tool you call and read — it's an actor that takes actions in your systems,
  so the blast radius is a wrong *action*, not a wrong answer, and reliability means bounding what
  it's allowed to do."
- "Bound the agent: least privilege (read-only by default), environment scoping, plan-then-apply
  dry-runs, and approval gates for destructive/irreversible/production actions — with a kill-switch
  to pause all autonomy and rate limits to catch loops."
- "Observe the agent, not just the app: an action audit trail of what it did, what it observed, and
  why, because a green dashboard won't tell you it restarted the wrong service, and a human stays
  accountable for every action."

**Hint stack**

- **H1 (nudge):** Ask what's different once the AI can *act* instead of just answer. A wrong answer
  is noise; a wrong action changes prod. The whole plan exists to limit what a confident-but-wrong
  action can break.
- **H2 (structure):** Walk the controls. Permissions: least privilege, env scoping. Pre-execution:
  dry-run + approval gate by blast radius. Runtime: rate limits + kill-switch. After: action audit
  trail + a human accountable.
- **H3 (worked path):** A memory alert → the agent autonomously restarts a service → leak persists →
  it loops. Don't rely on the agent being right: the action-rate limit trips and escalates, the
  human kill-switches autonomy, the audit trail shows the repeated remediation, and the real fix
  ships.

**Short FAQ**

- **Why is an ops agent riskier than a normal AI feature?** Because it doesn't just produce an
  answer — it takes actions with real effects. A wrong action (restart, config push, delete) hits
  production directly, so you bound its permissions and gate its high-blast actions.
- **What decides whether an action runs autonomously or needs approval?** Blast radius and
  reversibility. Read-only and low-risk reversible actions can be autonomous; destructive,
  irreversible, or production-facing actions need a human to approve.
- **Why log the agent's reasoning, not just its actions?** Because a postmortem and an audit need to
  know *why* it acted, not just what it did — that's how you catch a confident-but-wrong diagnosis
  and hold a human accountable for it.
- **Is prompt injection really an ops concern here?** Yes. A crafted log line, ticket, or error
  message can steer an action-taking agent into running something dangerous, so external text the
  agent reads is untrusted input and high-blast actions still need a gate.
