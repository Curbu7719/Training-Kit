# Security & Privacy in Depth: Governing AI Data Flows Across the SDLC

At L1 you learned what leaves your control when you prompt a model, the three risk families
(sensitive data, leaks, shadow AI), and the everyday safeguards. At L2 the question changes.
It is no longer *what the risks are*. It is *how you govern AI data flows as a system* —
because auditors, attackers, and regulators will test every gap between a developer's keyboard
and a vendor's training set.

**Data classification drives everything.** You cannot protect what you have not labelled.
Mature teams tag data — public, internal, confidential, regulated (PII/PHI/PCI) — and tie
**AI usage rules to each level**. Public snippets can go to any approved tool. Confidential
code needs a zero-retention enterprise tool. Regulated data is redacted or never sent. (PHI
is health data; PCI is payment-card data.) Classification turns "be careful" into a rule you
can enforce.

**Retention, residency, and training are contract terms, not vibes.** "Zero-retention" and
"no-train" must be checked in the agreement and in the API settings, not just assumed. Check
where prompts are processed (**data residency** — which country the data sits in), how long
they are stored, whether they enter a training set, and whether sub-processors (other
companies the vendor uses) see them. A free consumer tier and an enterprise tier of the
*same* product can give opposite answers.

**Leak surfaces multiply downstream.** The prompt is only the first place data can leak.
Sensitive data also leaks through **logs** (prompts and answers written to monitoring tools),
**caches**, and **vector stores** that hold embeddings of confidential text. (An embedding is
a numeric form of text that captures its meaning; a vector store is the database that holds
them.) It can leak through **prompt injection** that turns fetched content into an instruction
to send data out, through **model memorisation**, and through **multi-tenant** bleed, where
weak separation shows one tenant's data in another's session. Each surface needs its own
control. Redacting the prompt does nothing for a leaky log.

**Failure modes to design against.**

- **Redaction theatre:** a regex that misses messy, free-text PII, giving false confidence.
- **Shadow AI driven underground:** a full ban with no approved alternative, so usage
  continues out of sight with worse tools and no logging.
- **Log/observability leak:** prompts and outputs flow into a logging stack that a wider
  audience — or an attacker after a breach — can read.
- **Tenant isolation gap:** shared context or embeddings let one customer's data reach
  another customer.

**Operating the program over time.** Governance never stops. Keep the approved-tool list up
to date. Re-check vendor terms when they change. Watch for shadow AI through network and
expense signals. Scan prompts and outputs for secrets. Red-team prompt injection and tenant
separation. (Red-teaming means attacking your own system on purpose to find weak spots.) Log
AI interactions (with redaction) so misuse can be spotted — without the log itself becoming a
new leak surface.

## How each role uses this

- **Security Engineer:** Red-teams prompt injection, log leakage, and multi-tenant separation. Checks that no-train/zero-retention claims hold from end to end.
- **Developer:** Enforces classification at the moment of prompting. Wires redaction and secret scanning into tooling. Keeps prompts and outputs out of plain logs and shared caches.
- **Governance:** Maps each data class to its legal duty (residency, retention limits, consent). Owns vendor due diligence and the approved-tool list. Decides which classes may reach which tier of tool.
- **Enterprise Architect:** Designs the auditable logging that proves the controls really hold.
