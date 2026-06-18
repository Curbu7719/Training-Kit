# Layered Architecture — Concept

**Layered architecture** means organizing a system into distinct layers, where each layer has a clear, narrow responsibility and only talks to the layers next to it. Instead of one giant program that does everything, you slice the system into parts that each do one job well.

A common modern arrangement has four layers:

- **Client (UI) layer** — runs on the user's device (browser or app). It presents the interface, captures input, and calls APIs. It never holds secrets or enforces the "source of truth" rules, because anything sent to the user's device can be read or tampered with.
- **Backend-as-a-Service (BaaS) layer** — the managed backend: the database, authentication, file storage, and the access rules (such as row-level security) that decide who can read or write what. This is the authoritative store of data.
- **Serverless function layer** — small, short-lived pieces of server code that run on demand. They hold secret keys, centralize business logic, and safely talk to external services on the client's behalf.
- **External services** — third-party APIs you don't control: a payment provider, an email sender, a mapping service.

**Why separate them?** This is called *separation of concerns*. When each layer owns one responsibility, you can change, test, or replace one layer without rewriting the others. Swapping your email provider only touches the function that calls it; redesigning a button only touches the UI.

**Analogy:** think of a restaurant. The **dining room** (client) takes your order and serves you, but never decides the recipe. The **kitchen** (functions) prepares the dish following set rules and holds the secret recipe. The **pantry** (BaaS) stores ingredients under lock and key. The **supplier** (external service) delivers goods the kitchen ordered. Each role stays in its lane — and the restaurant runs smoothly because of it.
