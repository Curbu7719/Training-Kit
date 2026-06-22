# Security & Privacy in Depth: Governing AI Data Flows Across the SDLC

At L1 you learned what leaves your control when you prompt a model, the three risk families
(sensitive data, leaks, shadow AI), and the everyday safeguards. At L2 the question shifts
from *what the risks are* to *how you govern AI data flows as a system* — because auditors,
attackers, and regulators will probe every gap between a developer's keyboard and a vendor's
training set.

**Data classification drives everything.** You cannot protect what you haven't labelled.
Mature teams tag data — public, internal, confidential, regulated (PII/PHI/PCI) — and bind
**AI usage rules to each tier**: public snippets can go to any approved tool; confidential
code requires a zero-retention enterprise tool; regulated data is redacted or never sent.
Classification turns "be careful" into an enforceable policy.

**Retention, residency, and training are contract terms, not vibes.** "Zero-retention" and
"no-train" must be verified in the agreement and the API configuration, not assumed. Check
where prompts are processed (**data residency**), how long they're stored, whether they
enter a training set, and whether sub-processors see them. A consumer free tier and an
enterprise tier of the *same* product can have opposite answers.

**Leak surfaces multiply downstream.** The prompt is only the first surface. Sensitive data
also leaks through **logs** (prompts and completions written to observability tools),
**caches**, **vector stores** holding embeddings of confidential text, **prompt injection**
that reframes fetched content into an exfiltration instruction, **model memorisation**, and
**multi-tenant** bleed where weak isolation surfaces one tenant's data in another's session.
Each surface needs its own control; redacting the prompt does nothing for a leaky log.

**Failure modes to design against.**

- **Redaction theatre:** a regex that misses unstructured PII, giving false confidence.
- **Shadow AI driven underground:** a blanket ban with no sanctioned alternative, so usage
  continues invisibly with worse tools and no logging.
- **Log/observability leak:** prompts and outputs flow into a logging stack that a broader
  audience — or a breach — can read.
- **Tenant isolation gap:** shared context or embeddings let one customer's data reach
  another.

**Operating the program over time.** Governance is continuous: maintain the approved-tool
list, audit vendor terms when they change, monitor for shadow AI through network and expense
signals, scan prompts and outputs for secrets, and red-team prompt injection and tenant
isolation. Log AI interactions (with redaction) so misuse is detectable without becoming a
new leak surface itself.

## How each role uses this

- **Security Engineer:** Red-teams prompt injection, log leakage, and multi-tenant isolation, and verifies no-train/zero-retention claims hold end to end.
- **Developer:** Enforces classification at the point of prompting, wires redaction and secret scanning into tooling, and excludes prompts/outputs from plain logs and shared caches.
- **Governance:** Maps each data class to its regulatory obligation (residency, retention limits, consent), owns vendor due diligence and the approved-tool list, and decides which classes may reach which tier of tool.
- **Enterprise Architect:** Designs the auditable logging that proves the controls actually hold.
