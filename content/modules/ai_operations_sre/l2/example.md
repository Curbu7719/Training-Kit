# Worked Example: Operate a Whole Fleet of Acting Agents Without Losing the Plot

One on-call agent you can watch. A *fleet* — a CI agent, an infra agent, an on-call agent, across many teams — is a different problem: their permissions, decisions, and costs all compound, and the models under them change out from under you. Here's how governing the fleet keeps the help from becoming a sprawl you can't account for.

**Permissions as code, not consoles.** At fleet scale you can't click-grant access per agent. Each agent gets its own **service identity**, least-privilege scopes, and environment boundaries, all as **policy-as-code** reviewed like any change. *Why does this make your day easier?* You can see and diff exactly what every agent may do — instead of discovering its powers during an incident.

**Uniform gates on the dangerous classes.** High-blast actions carry mandatory approval *across every agent*, and **change windows** apply — no autonomous prod actions during a freeze. *Why use agents this way?* Consistency means you reason about the fleet once, not re-audit each team's ad-hoc rules.

**Incidents now come in two flavors.** Agents are both responders (auto-triage, runbook execution) and *causes* (an agent took a bad action). *Why does this matter?* Your incident process has to handle "the agent was wrong" as a first-class case — so when one acts badly, you can trace, contain, and roll back its actions, not just human ones.

**The ground shifts under you.** The model and tools beneath the fleet get upgraded and deprecated. *The move:* version and evaluate agents as the model changes, so a provider's silent update doesn't quietly change how fifty agents behave. *Why?* "It worked last month" isn't safety when the foundation moved.

**The takeaway:** a fleet of acting agents is leverage only if it's governed. Policy-as-code identities, uniform gates on dangerous actions, an incident process that treats agents as causes, and lifecycle management as models change — that's what lets the fleet scale your team instead of outscaling your control.
