# Tool Use and Agents: Letting a Model Act on a Codebase, Not Just Talk

On its own, a language model can only produce text. It cannot run your test suite, search the
repository, or open a ticket — it has no live access to your tools. **Tool use** (also called
**function calling**) closes that gap. You describe a set of tools to the model. Each tool has
a name, a description, and the inputs it accepts. When the model decides a tool would help, it
does not run anything itself. It outputs a structured **request** ("call `run_tests` with
`path=tests/`"). Your application runs the real command. Then it feeds the **result** back into
the conversation, and the model keeps going with that new information.

**An analogy:** the model is a sharp engineer working with you over a screen share. It cannot
touch the keyboard itself, but it can say "run the test suite and read me the failure." You
(your application) run the command and read the output back. The model thinks; your code does
the work.

**The agent loop.** A single tool call is useful, but real dev tasks need several steps. An
**agent** is an AI that can take actions in a loop. It runs this loop: **plan** the next step,
**act** by requesting a tool, **observe** the result that comes back, then repeat. Each time,
it decides whether to call another tool or to stop. "Fix the failing test in `cart.py`" might
loop through running tests, searching the code, editing, and running again before the test
passes.

**When an agent beats a single call.** Use a plain single call for one-shot tasks (summarize
this PR). Reach for an agent when the task is **multi-step, needs fresh state, or depends on
results from earlier steps** — like fixing a bug, where each edit must be re-tested before the
next decision.

**Failure modes.** Autonomy cuts both ways:

- **Runaway loops** — the model keeps running tests and editing without ever finishing, wasting
  time and money.
- **Wrong tool** — it edits a file when it should have searched, or runs a harmful command for
  no reason.
- **Destructive actions** — an unguarded `delete_branch` or force-push tool acts on real
  infrastructure.
- **Compounding errors** — one misread test failure early on misleads every later edit.

**Guardrails** keep these in check: a **maximum-iteration limit** to stop loops, **timeouts
and budgets**, **human approval** for risky actions like pushing or deleting, and **validating
tool inputs** before running them. Autonomy is powerful only when it has limits. Our **internal AI Agent platform** is where this comes together for every role: it provides the agents and approved tools with these limits — iteration caps, approval gates, input validation — already built in, so you build on safe defaults instead of wiring them up per project.

## How each role uses this

- **Developer:** Defines the tool schemas (run the test suite, search the codebase, apply a patch). Writes the execution layer, plus the loop limits and input validation that keep a coding agent safe.
- **Enterprise Architect:** Sets the allowed-tool boundaries and approval gates as part of the architecture. Decides single-call vs agent.
- **Security Engineer:** Limits which systems and data the agent may reach. Requires approval for harmful or irreversible actions.
- **Tester:** Builds an agent that sorts out flaky tests. Tests that the loop stops correctly and handles the failure modes.
- **Project Manager:** Decides when a feature truly needs an agent vs a cheaper single call. Limits its autonomy and budgets the cost per iteration.
