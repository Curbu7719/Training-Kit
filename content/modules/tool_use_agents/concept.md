# Tool Use and Agents: Letting a Model Act, Not Just Talk

On its own, a language model can only produce text. It can't look up today's stock price, query your database, or send an email — it has no live access to the world. **Tool use** (also called **function calling**) closes that gap. You describe a set of tools to the model — each with a name, a description, and the inputs it accepts. When the model decides a tool would help, it doesn't run anything itself; it outputs a structured **request** ("call `get_weather` with city=`Paris`"). Your application runs the real function and feeds the **result** back into the conversation, and the model continues with that new information.

**An analogy:** the model is a smart analyst in a room with a phone. It can't fetch records itself, but it can call out: "Look up order #4521 and read me the status." An assistant outside (your code) does the lookup and reads the answer back. The analyst reasons; the assistant executes.

**The agent loop.** A single tool call is useful, but many real tasks need several steps. An **agent** runs a loop: **plan** the next step, **act** by requesting a tool, **observe** the returned result, then repeat — deciding each time whether to call another tool or to finish. "Book the cheapest flight under \$300" might loop through searching, comparing, and confirming before answering.

**When an agent beats a single call.** Use a plain single call for one-shot tasks (summarize this text). Reach for an agent when the task is **multi-step, requires fresh or external data, or depends on intermediate results** the model can't know in advance — like research across sources or operating on a live system.

**Risks.** Autonomy cuts both ways:

- **Runaway loops** — the model keeps calling tools without converging, burning time and money.
- **Cost** — each iteration is another model call; long loops get expensive fast.
- **Compounding errors** — a wrong observation early can mislead every later step.

**Guardrails** manage these: a **maximum-iteration limit** to stop loops, **timeouts and budgets**, **human approval** for risky actions like sending money, and **validating tool inputs** before executing. Autonomy is powerful only when it's bounded.

## How each role uses this

- **Developer/Engineer:** Defines tool schemas and writes the execution layer that runs the requested function and returns results, plus the loop limits and input validation that keep it safe.
- **Business Analyst:** Identifies which real systems and data sources the agent must reach, and where a human-approval step belongs in the workflow.
- **PM/Product Owner:** Decides when a feature genuinely needs an autonomous agent versus a cheaper single call, and budgets for the per-iteration cost.
- **QA & Architect:** Tests loop termination, failure modes, and guardrail limits, and designs the boundaries (timeouts, approvals, allowed tools) that contain runaway or compounding errors.
