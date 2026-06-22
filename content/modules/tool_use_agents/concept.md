# Tool Use and Agents: Letting a Model Act on a Codebase, Not Just Talk

On its own, a language model can only produce text. It can't run your test suite, grep the repository, or open a ticket — it has no live access to your tools. **Tool use** (also called **function calling**) closes that gap. You describe a set of tools to the model — each with a name, a description, and the inputs it accepts. When the model decides a tool would help, it doesn't run anything itself; it outputs a structured **request** ("call `run_tests` with `path=tests/`"). Your application runs the real command and feeds the **result** back into the conversation, and the model continues with that new information.

**An analogy:** the model is a sharp engineer pairing with you over a screen share. It can't touch the keyboard itself, but it can say "run the test suite and read me the failure." You (your application) execute the command and read the output back. The model reasons; your code executes.

**The agent loop.** A single tool call is useful, but real dev tasks need several steps. An **agent** runs a loop: **plan** the next step, **act** by requesting a tool, **observe** the returned result, then repeat — deciding each time whether to call another tool or to finish. "Fix the failing test in `cart.py`" might loop through running tests, searching the code, editing, and re-running before it's green.

**When an agent beats a single call.** Use a plain single call for one-shot tasks (summarize this PR). Reach for an agent when the task is **multi-step, requires fresh state, or depends on intermediate results** — like fixing a bug, where each edit must be re-tested before the next decision.

**Failure modes.** Autonomy cuts both ways:

- **Runaway loops** — the model keeps running tests and editing without converging, burning time and money.
- **Wrong tool** — it edits a file when it should have searched, or calls a destructive command unnecessarily.
- **Destructive actions** — an unguarded `delete_branch` or force-push tool acts on real infrastructure.
- **Compounding errors** — a misread test failure early misleads every later edit.

**Guardrails** manage these: a **maximum-iteration limit** to stop loops, **timeouts and budgets**, **human approval** for risky actions like pushing or deleting, and **validating tool inputs** before executing. Autonomy is powerful only when it's bounded.

## How each role uses this

- **Developer:** Defines the tool schemas (run the test suite, search the codebase, apply a patch) and writes the execution layer plus loop limits and input validation that keep a coding agent safe.
- **Enterprise Architect:** Sets the allowed-tool boundaries and approval gates as architecture, and decides single-call vs agent.
- **Security Engineer:** Scopes which systems and data the agent may reach and requires approval for destructive or irreversible actions.
- **Tester:** Builds an agent that triages flaky tests and tests loop termination and failure modes.
- **Project Manager:** Decides when a feature genuinely needs an agent vs a cheaper single call, scopes its autonomy, and budgets the per-iteration cost.
