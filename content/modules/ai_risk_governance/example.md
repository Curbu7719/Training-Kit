# Worked Example: Governing a New AI Customer-Support Assistant

**The situation.** A retail company wants to launch an AI assistant that answers customer
questions about orders. It will read the customer's name, address, and order history, and
draft replies. Before any of this ships, the governance process steps in — not to block the
project, but to make each risk visible and assign an owner.

**Step 1 — Register the use.** The team adds the assistant to the **AI use register**: what
it does, which data it touches (customer PII and order records), which external model
provider it calls, and a **risk tier** of "high" because it handles personal data and faces
customers.

**Step 2 — Check data privacy and the contract.** The Business Analyst confirms customer
PII is in scope of privacy law (GDPR/KVKK). Legal reviews the provider contract for two
things: whether customer data could be **reused to train** the vendor's model, and **who
owns the output**. They negotiate a no-training clause and turn on data-residency controls.

**Step 3 — Apply the acceptable-use policy.** Policy says raw customer identifiers must not
leave the company's systems unmasked, so engineering adds **PII redaction** before prompts
are sent, and **logging** so every prompt and reply is recorded for audit.

**Step 4 — Add oversight and an approval gate.** Because replies are customer-facing, the
team adds a **human-in-the-loop** review for any reply touching refunds or complaints, and
an **approval gate** so the product owner signs off before the assistant goes live.

**Step 5 — Test for bias and reliability.** QA checks that the assistant does not give worse
answers based on a customer's name or location (**bias**), and that it says "I don't know"
instead of inventing an order status (**reliability**).

**The outcome.** The assistant launches, but every risk now has a named control behind it:
the register records it, the contract settles ownership and training, redaction and logging
protect privacy, and human oversight plus testing guard reliability and fairness. Governance
turned an open-ended risk into a set of owned, auditable decisions.
