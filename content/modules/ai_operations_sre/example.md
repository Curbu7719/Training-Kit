# Worked Example: Putting an On-Call Agent Into Production

Your team has built an **on-call agent**: it receives alerts, investigates with read-only tools
(logs, metrics, traces), and can remediate. Building it is done; now you have to **operate** it
safely. Here's how a team stands it up — and survives the first incident the agent itself causes.

## Step 1 — Classify the agent's actions by blast radius

Before granting any autonomy, the team sorts every action the agent can take and sets a
human-in-the-loop level for each class:

| Action class | Example | Autonomy level |
|---|---|---|
| Read-only | Read logs, metrics, traces | Autonomous |
| Reversible, low-blast | Restart a stateless service, scale up a replica | Autonomous (with rate limit) |
| Production-facing, risky | Roll back a deploy, change a DB connection | Approve-then-act |
| Destructive / irreversible | Delete data, drop a resource, run arbitrary shell | Suggest-only |

## Step 2 — Bound it: least privilege, dry-run, approval gates

The agent gets **read-only** credentials by default; write scopes are granted **per class**, and
it has no production action without passing a gate. Every write is **plan-then-apply** — the agent
states the exact change and expected effect first. A **kill-switch** can pause all autonomy in one
click, and an **action-rate limit** caps how many actions it may take in a window.

## Step 3 — Instrument the action audit trail

Every step the agent takes emits a record: the alert it picked up, the tools it called, what it
observed, the decision and **why**, and the action taken (or proposed). This trail is correlatable
to the incident — so a human can later see exactly what the agent did and on what reasoning. App
dashboards stay green either way; the audit trail is how you know the agent acted *correctly*.

## Step 4 — The first incident is the agent's own

Two weeks in, a "high memory" alert fires on a stateless service. The agent is allowed autonomous
restarts for that reversible class, so it restarts the service. Memory climbs again; it restarts
again. A real **memory leak** is the cause — but the agent is treating the symptom, **confident and
wrong**, and slides into a **restart loop** that masks the leak.

What saves it is the bounding from Step 2:

1. **The action-rate limit trips** — "5 restart actions on one service in 10 minutes" → the agent
   stops and **escalates** to a human instead of restarting a sixth time.
2. **The on-call human hits the kill-switch** for that agent's autonomy.
3. **The audit trail** shows the repeated identical remediation, so the human sees instantly the
   agent was symptom-fighting, finds the leak, and ships a real fix.

No data was lost and no destructive action ran — because a restart was reversible *and* rate-limited,
not because the agent was right.

## Step 5 — Close the loop

A **blameless postmortem**: the trigger (memory leak), what worked (rate limit + kill-switch +
audit trail), and two improvements — add a guard so "same remediation N times → stop and escalate"
is built in, and move "repeated restart" out of the autonomous class. That guard becomes a
permanent part of the agent's policy.

**The lesson.** None of this was about a smarter agent. The system stayed safe because the agent
was **bounded** (least privilege, reversible-only autonomy), **rate-limited and kill-switchable**
(the loop was caught), **observed** (the audit trail explained the misfire), and **operated** (a
human stayed accountable and closed the loop). That's the difference between building an agent and
running one in production.
