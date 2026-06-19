# Hints & Alternative Phrasings

**Alternative phrasings of the core idea**

- "At fleet scale you stop granting access per agent in a console — each agent has its own identity
  and least-privilege scopes expressed as policy-as-code, with change windows and uniform approval
  for high-blast actions."
- "Agents are both responders and causes, so incidents split into agent-misfire, runaway loop,
  injection compromise, and permission fault — the universal control is pause autonomy (kill-switch)
  and revert the action, and every misfire becomes a new guardrail and eval case."
- "An agent's behaviour is its policy = prompt + tools + permissions + model, versioned like code and
  rolled out by shadow (dry-run, compare proposed actions to humans) → canary (act on a small slice)
  → flagged rollout with policy rollback ready."

**Hint stack**

- **H1 (nudge):** Think about what changes *over time and across a fleet*: permissions multiply, the
  model gets deprecated, and one looping agent can spend fast. The answer is usually a deliberate
  policy and process, not a one-off fix.
- **H2 (structure):** For a behaviour change, the safe path is shadow (dry-run, compare proposed
  actions to what humans did) → canary (autonomous on a small slice) → flagged rollout with policy
  rollback. For cost, separate attribution (which agent spent) from control (action-rate and spend
  caps). For incidents, classify and kill-switch.
- **H3 (worked path):** A runaway agent taking actions at 6× its rate, driven by an injected log line:
  the destructive-action gate blocks the dangerous command, the action-rate cap throttles and
  escalates, per-agent attribution finds the culprit fast, and the postmortem turns it into an
  input-trust guard and an eval case.

**Short FAQ**

- **Why shadow an agent instead of just switching the model?** Because the agent *acts*: a new model
  can make it more or less eager to take actions, silently. Shadowing compares its proposed actions
  on real events before any execute, so you roll out on evidence, not hope.
- **Why per-agent cost anomaly detection and action-rate caps?** Each agent step is an LLM call and
  may spin up resources, so a loop spends fast. Anomaly detection catches the deviation early, the
  rate cap bounds the damage, and per-agent attribution tells you which one to stop.
- **Why does every agent misfire become an eval case?** Because a unit test won't catch a
  non-deterministic wrong action. Turning each misfire into a guardrail and an offline eval case is
  how the fleet's policy grows teeth and the same wrong action can't silently return.
- **Why treat logs and tickets as untrusted input?** Because an action-taking agent that reads them
  can be steered by injected text into a harmful action. External text is untrusted input, and
  high-blast actions still pass an approval gate regardless of what a log 'suggests'.
