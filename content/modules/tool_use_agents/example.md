# Worked Example: Hand the Whole Bug to an Agent, Not Just a Question

A plain chatbot can tell you *how* to fix the failing test in `cart.py`. An **agent** can actually fix it — run the tests, read the failure, edit the file, re-run, repeat until green. Here's the difference, and why letting the model *act* (within limits) saves your afternoon.

**A single call vs an agent.** For "summarize this PR," one call is plenty. But "fix the failing test" needs steps that depend on each other — you can't know the next edit until you've seen the last test run. *Why use an agent here?* It runs the plan → act → observe loop for you, instead of you copy-pasting output back into the chat ten times.

**How it acts without touching the keyboard.** The model can't run anything itself; it *requests* a tool — "call `run_tests` with `path=tests/`" — and your code runs the real command and feeds the result back. *Why does this make your day easier?* You define a few tools once (run tests, search code, apply patch) and the agent strings them together for every future bug, not just this one.

**The reason to bound it.** Autonomy cuts both ways: it might loop forever editing and re-testing, or call a destructive command. *The guardrails that let you say yes:* a max-iteration limit so it can't spin all night, and a human-approval gate before it pushes or deletes. *Why use the agent at all then?* Because bounded autonomy does the tedious 90% — the run/read/edit grind — and stops to ask you only at the moments that need judgment.

**Stay in control.** Start it on a low-stakes bug, watch one full loop, and confirm it stops on its own. Trust the autonomy *after* you've seen the limits hold.

**The takeaway:** reach for a single call when you want advice; reach for an agent when you want the task *done*. Give it the right tools and firm limits, and it turns a multi-step grind into one request you supervise.
