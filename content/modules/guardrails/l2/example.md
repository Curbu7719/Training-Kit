# Worked Example: Tune the Guardrails So People Actually Use the Agent

Your AI agent is locked down so hard that developers route around it — and a guardrail people disable protects nothing. At depth the job isn't *more* gates; it's putting each gate where it pays off and tuning the trade-off. Here's how that keeps both the agent safe and your team willing to use it.

**Put each control where it has context.** An obviously dangerous command is cheapest to stop **in-action** with a deny list; a subtly leaked credential can only be caught **post-action** by scanning the actual diff. *Why does this make your day easier?* You stop paying for a slow human review on changes a cheap automated check already cleared.

**Tune the trade-off triangle per risk tier.** A docs typo fix flows straight through; a change touching auth or prod config gets the full gate. *Why use the AI here?* Because tiering means the agent handles the routine 90% with no friction, and you spend your attention only where the risk is real — instead of rubber-stamping everything until you stop reading.

**Don't trust input validation alone.** Injection arrives indirectly — in a dependency's README, a PR comment, a file the agent reads as data. *The move:* assume any fetched content is hostile and rely on **least-privilege sandboxing** so a successful injection still can't exfiltrate or destroy. *Why?* You can't pre-screen text you haven't fetched yet — so you constrain what the agent can *do*, not just what it reads.

**Watch the two failure modes.** Over-blocking makes people bypass the agent (so safe ops must pass); under-blocking lets a reframed request through (so layers must overlap). A single scanner that's misconfigured is a single point of failure — independent layers are the backstop.

**The takeaway:** mature guardrails aren't a taller wall — they're a tuned pipeline. Gate by risk tier, keep legitimate work fast, and layer independent checks, so the agent stays safe *and* your team keeps reaching for it instead of working around it.
