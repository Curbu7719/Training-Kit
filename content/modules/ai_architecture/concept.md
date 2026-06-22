# AI System Architecture & Deployment

A useful AI feature is almost never "just the model." Around the model sits a set of
parts that turn a raw text-prediction engine into a reliable product. A
**reference architecture** helps you think about where each job lives. (A reference
architecture is a standard layout of the parts and how they connect.)

**The core path.** Most LLM applications follow the same flow:

- **Client** — the app the user sees (web, mobile, or another service) that takes the
  request and shows the result.
- **App / orchestration layer** — the server-side "brain" of the feature. It builds the
  prompt, decides which model to call, runs any multi-step logic, and enforces rules.
  (Orchestration means the code that coordinates all the steps in the right order.)
  This is where your own application code lives; it should never sit in the client.
- **Model provider** — the LLM itself, called over an API. It is swappable: a good
  design treats it as a part you can replace, not a fixed core.

**Supporting components.** Around that path you commonly add:

- **Vector store** — holds embeddings of your documents so the app can pull in relevant
  context to ground its answers (retrieval-augmented generation). (A vector store is a
  search index for meaning, so the app can find the most related text.)
- **Tools / functions** — let the model trigger real actions (look up an order, run a
  calculation, call an outside API) instead of only producing text.
- **Guardrails** — input and output checks that block unsafe, off-topic, or broken
  content before it reaches the model or the user.
- **Evaluation & observability** — logging, tracing, and quality checks so you can see
  what the system did and whether it did it well. (Observability means you can see
  what is happening inside the system from the outside.)

**An analogy.** Think of a call center. The customer (client) talks to a front desk
(orchestration) that looks things up in the filing system (vector store), can phone other
departments (tools), follows a script with compliance rules (guardrails), and is
recorded and reviewed for quality (observability). The actual person answering is one
staff member you could replace (the model).

**Cross-cutting concerns.** These apply across the whole system, not one box: keeping
secrets and API keys on the server; privacy and data governance for PII (personal data
that identifies someone); reliability and **fallbacks** when the provider fails (a
fallback is a backup plan when the first option breaks); **provider abstraction** so you
can swap models; monitoring and logging; and cost controls. **Deployment and rollout**
follow normal software practice — ship behind flags, roll out a bit at a time, and watch
the evaluation metrics.

## How each role uses this

- **Enterprise Architect:** Designs for reliability (fallbacks, swappable providers) and makes sure observability and evaluation are in place to catch problems in production.
- **Developer:** Builds the orchestration layer, wires in retrieval, tools, and guardrails, and keeps the model behind an abstraction so it can be swapped.
- **Security Engineer:** Maps where PII flows through the architecture and which steps need data-governance controls before launch.
- **Project Manager:** Decides which guardrails and fallbacks the feature's risk level needs, and plans the rollout.
- **DevOps Engineer:** Runs the flagged, gradual rollout and the monitoring that watches the metrics.
