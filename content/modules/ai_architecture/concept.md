# AI System Architecture & Deployment

A useful AI feature is almost never "just the model." Around the model sits a set of
components that turn a raw text-prediction engine into a reliable product. A
**reference architecture** helps you reason about where each responsibility lives.

**The core path.** Most LLM applications follow the same flow:

- **Client** — the user-facing app (web, mobile, or another service) that captures the
  request and shows the result.
- **App / orchestration layer** — the server-side "brain" of the feature. It builds the
  prompt, decides which model to call, runs any multi-step logic, and enforces rules.
  This is where your application's own code lives; it should never sit in the client.
- **Model provider** — the LLM itself, called over an API. It is interchangeable: a good
  design treats it as a swappable dependency, not a hard-wired core.

**Supporting components.** Around that path you commonly add:

- **Vector store** — holds embeddings of your documents so the app can retrieve relevant
  context to ground answers (retrieval-augmented generation).
- **Tools / functions** — let the model trigger real actions (look up an order, run a
  calculation, call an external API) instead of only producing text.
- **Guardrails** — input and output checks that block unsafe, off-topic, or malformed
  content before it reaches the model or the user.
- **Evaluation & observability** — logging, tracing, and quality checks so you can see
  what the system did and whether it did it well.

**An analogy.** Think of a call center. The customer (client) talks to a front desk
(orchestration) that looks things up in the filing system (vector store), can phone other
departments (tools), follows a script with compliance rules (guardrails), and is
recorded and reviewed for quality (observability). The actual "agent" answering is one
replaceable staff member (the model).

**Cross-cutting concerns.** These apply across the whole system, not one box: keeping
secrets and API keys server-side; privacy and data governance for PII; reliability and
**fallbacks** when the provider fails; **provider abstraction** so you can swap models;
monitoring and logging; and cost controls. **Deployment and rollout** follow normal
software practice — ship behind flags, roll out gradually, and watch evaluation metrics.

## How each role uses this

- **Enterprise Architect:** Designs for reliability (fallbacks, provider swappability) and ensures observability and evaluation are in place to catch regressions in production.
- **Developer:** Implements the orchestration layer, wires in retrieval, tools, and guardrails, and keeps the model behind an abstraction so it can be swapped.
- **Security Engineer:** Maps where PII flows through the architecture and which steps need data-governance controls before launch.
- **Project Manager:** Decides which guardrails and fallbacks the feature's risk level requires, and plans the rollout.
- **DevOps Engineer:** Runs the flagged, gradual rollout and the monitoring that watches the metrics.
